import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Routine Step Schema
export const routineStepSchema = z.object({
  title: z.string(),
  duration: z.number(),
  voiceCue: z.string().optional(),
});

// Routine Block Schema
export const routineBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["motivational", "exercise", "cognitive"]),
  title: z.string(),
  durationMinutes: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  progress: z.number().default(0),
  steps: z.array(routineStepSchema),
});

// Day Schema
export const routineDaySchema = z.object({
  day: z.number(),
  blocks: z.array(routineBlockSchema),
});

// Full Routine Schema
export const routineSchema = z.object({
  days: z.array(routineDaySchema),
});

export type RoutineStep = z.infer<typeof routineStepSchema>;
export type RoutineBlock = z.infer<typeof routineBlockSchema>;
export type RoutineDay = z.infer<typeof routineDaySchema>;
export type Routine = z.infer<typeof routineSchema>;

// Insert schemas for API
export const generateRoutineRequestSchema = z.object({
  injuryType: z.string(),
  mobilityLevel: z.string(),
  dailyTime: z.string(),
  intensity: z.string(),
  goals: z.string(),
});

export type GenerateRoutineRequest = z.infer<typeof generateRoutineRequestSchema>;

export const saveRoutineRequestSchema = z.object({
  routine: routineSchema,
  metadata: z.object({
    name: z.string().optional(),
    createdAt: z.string().optional(),
  }).optional(),
});

export type SaveRoutineRequest = z.infer<typeof saveRoutineRequestSchema>;
