import { type User, type InsertUser, type Routine } from "@shared/schema";
import { randomUUID } from "crypto";
import * as fs from "fs/promises";
import * as path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveRoutine(routine: Routine, metadata?: any): Promise<{ id: string }>;
  loadRoutine(id: string): Promise<{ routine: Routine; metadata: any } | null>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private routinesDir: string;

  constructor() {
    this.users = new Map();
    this.routinesDir = path.join(process.cwd(), "data", "routines");
    this.ensureRoutinesDir();
  }

  private async ensureRoutinesDir() {
    try {
      await fs.mkdir(this.routinesDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create routines directory:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveRoutine(routine: Routine, metadata?: any): Promise<{ id: string }> {
    const id = randomUUID();
    const data = {
      routine,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
    };
    
    const filePath = path.join(this.routinesDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return { id };
  }

  async loadRoutine(id: string): Promise<{ routine: Routine; metadata: any } | null> {
    try {
      const filePath = path.join(this.routinesDir, `${id}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
}

export const storage = new MemStorage();
