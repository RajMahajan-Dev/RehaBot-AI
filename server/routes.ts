import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRoutineWithGemini } from "./gemini";
import {
  generateRoutineRequestSchema,
  saveRoutineRequestSchema,
  type Routine,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate routine using Gemini AI
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = generateRoutineRequestSchema.parse(req.body);
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment." 
        });
      }

      const routine = await generateRoutineWithGemini(validatedData);
      
      res.json(routine);
    } catch (error: any) {
      console.error("Error generating routine:", error);
      
      // Distinguish validation errors from server errors
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Invalid input data",
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: error.message || "Failed to generate routine" 
      });
    }
  });

  // Save routine to file storage
  app.post("/api/save", async (req, res) => {
    try {
      const validatedData = saveRoutineRequestSchema.parse(req.body);
      
      const result = await storage.saveRoutine(
        validatedData.routine,
        validatedData.metadata
      );
      
      res.json(result);
    } catch (error: any) {
      console.error("Error saving routine:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Invalid routine data",
          details: error.errors 
        });
      }
      
      res.status(500).json({ 
        error: error.message || "Failed to save routine" 
      });
    }
  });

  // Load routine by ID
  app.get("/api/load/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const data = await storage.loadRoutine(id);
      
      if (!data) {
        return res.status(404).json({ error: "Routine not found" });
      }
      
      res.json(data);
    } catch (error: any) {
      console.error("Error loading routine:", error);
      res.status(500).json({ 
        error: error.message || "Failed to load routine" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
