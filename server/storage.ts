import { type User, type InsertUser, type Message, type InsertMessage, type UserSettings, type InsertUserSettings, type Recording, type InsertRecording, users, messages, userSettings, recordings } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Message operations
  getMessages(userId: string, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;

  // Recording operations
  getRecordingsByClient(clientId: string): Promise<Recording[]>;
  createRecording(recording: InsertRecording): Promise<Recording>;
  updateRecordingStatus(id: string, status: string): Promise<Recording | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Message operations
  async getMessages(userId: string, limit?: number): Promise<Message[]> {
    const query = db
      .select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(desc(messages.timestamp));

    if (limit) {
      return await query.limit(limit);
    }

    return await query;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  // Settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [result] = await db
      .insert(userSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          calendarConnected: settings.calendarConnected,
          recordingRule: settings.recordingRule,
          exclusions: settings.exclusions,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Recording operations
  async getRecordingsByClient(clientId: string): Promise<Recording[]> {
    return await db
      .select()
      .from(recordings)
      .where(eq(recordings.clientId, clientId))
      .orderBy(desc(recordings.uploadedAt));
  }

  async createRecording(recording: InsertRecording): Promise<Recording> {
    const [newRecording] = await db.insert(recordings).values(recording).returning();
    return newRecording;
  }

  async updateRecordingStatus(id: string, status: string): Promise<Recording | undefined> {
    const [updated] = await db
      .update(recordings)
      .set({ status })
      .where(eq(recordings.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
