import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertUserSettingsSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
