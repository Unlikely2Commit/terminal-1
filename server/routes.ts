import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertMessageSchema, insertUserSettingsSchema, insertRecordingSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/x-m4a", "video/mp4", "video/webm"];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|mp4|m4a|wav|webm)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload an audio or video file."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Demo user ID - in a real app this would come from session
  const DEMO_USER_ID = "demo-user";

  // Activity Log: Get all messages for the current user
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(DEMO_USER_ID);
      // Return in reverse chronological order (newest first)
      res.json(messages.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Activity Log: Create a new message
  app.post("/api/messages", async (req, res) => {
    try {
      const validated = insertMessageSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const message = await storage.createMessage(validated);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Settings: Get user settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(DEMO_USER_ID);
      
      // Return default settings if none exist
      if (!settings) {
        res.json({
          userId: DEMO_USER_ID,
          calendarConnected: false,
          recordingRule: "selective",
          exclusions: "",
        });
        return;
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Settings: Update user settings
  app.put("/api/settings", async (req, res) => {
    try {
      const validated = insertUserSettingsSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const settings = await storage.upsertUserSettings(validated);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  // Recordings: Get recordings for a client
  app.get("/api/recordings/:clientId", async (req, res) => {
    try {
      const recordings = await storage.getRecordingsByClient(req.params.clientId);
      res.json(recordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      res.status(500).json({ error: "Failed to fetch recordings" });
    }
  });

  // Recordings: Upload a new recording with file
  app.post("/api/recordings", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      
      const { clientId, meetingDate, meetingType } = req.body;
      
      if (!clientId || !meetingDate || !meetingType) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      
      const recording = await storage.createRecording({
        clientId,
        meetingDate,
        meetingType,
        fileName: file.originalname,
        fileSize: file.size,
        filePath: file.path,
        duration: null,
        uploadedBy: DEMO_USER_ID,
        status: "processing",
      });
      
      // Simulate processing delay (in production this would be async transcription)
      setTimeout(async () => {
        try {
          await storage.updateRecordingStatus(recording.id, "ready");
        } catch (e) {
          console.error("Error updating recording status:", e);
        }
      }, 3000);
      
      res.status(201).json(recording);
    } catch (error) {
      console.error("Error creating recording:", error);
      res.status(400).json({ error: "Invalid recording data" });
    }
  });

  // Recordings: Update recording status
  app.patch("/api/recordings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["processing", "ready", "error"].includes(status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
      }
      const recording = await storage.updateRecordingStatus(req.params.id, status);
      if (!recording) {
        res.status(404).json({ error: "Recording not found" });
        return;
      }
      res.json(recording);
    } catch (error) {
      console.error("Error updating recording status:", error);
      res.status(500).json({ error: "Failed to update recording status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
