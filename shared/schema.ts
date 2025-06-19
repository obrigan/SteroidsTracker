import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Gamification fields
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  totalInjections: integer("total_injections").default(0),
  totalCourses: integer("total_courses").default(0),
  totalBloodTests: integer("total_blood_tests").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Steroid courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: varchar("status").notNull().default("active"), // active, completed, paused
  courseType: varchar("course_type").notNull(), // bulk, cut, strength, etc.
  totalWeeks: integer("total_weeks"),
  currentWeek: integer("current_week").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compounds/drugs in courses
export const courseCompounds = pgTable("course_compounds", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  compoundName: varchar("compound_name").notNull(),
  dosageAmount: decimal("dosage_amount", { precision: 8, scale: 2 }).notNull(),
  dosageUnit: varchar("dosage_unit").notNull(), // mg, ml, etc.
  frequency: integer("frequency").notNull(), // times per week
  injectionSites: text("injection_sites").array(),
  startWeek: integer("start_week").default(1),
  endWeek: integer("end_week"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Injections log
export const injections = pgTable("injections", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  compoundName: varchar("compound_name").notNull(),
  dosageAmount: decimal("dosage_amount", { precision: 8, scale: 2 }).notNull(),
  dosageUnit: varchar("dosage_unit").notNull(),
  injectionSite: varchar("injection_site").notNull(),
  injectionDate: timestamp("injection_date").notNull(),
  notes: text("notes"),
  painLevel: integer("pain_level"), // 1-10 scale
  photoUrl: varchar("photo_url"),
  xpEarned: integer("xp_earned").default(15),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blood tests
export const bloodTests = pgTable("blood_tests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  testDate: date("test_date").notNull(),
  testType: varchar("test_type").notNull(), // full_panel, hormone_panel, etc.
  results: jsonb("results").notNull(), // JSON object with test values
  doctorNotes: text("doctor_notes"),
  alertFlags: text("alert_flags").array(),
  xpEarned: integer("xp_earned").default(25),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress photos
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  photoUrl: varchar("photo_url").notNull(),
  bodyPart: varchar("body_part").notNull(), // chest, arms, legs, etc.
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bodyFat: decimal("body_fat", { precision: 4, scale: 2 }),
  notes: text("notes"),
  xpEarned: integer("xp_earned").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: varchar("achievement_type").notNull(),
  achievementName: varchar("achievement_name").notNull(),
  description: text("description"),
  iconUrl: varchar("icon_url"),
  xpReward: integer("xp_reward").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  injections: many(injections),
  bloodTests: many(bloodTests),
  progressPhotos: many(progressPhotos),
  achievements: many(achievements),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  compounds: many(courseCompounds),
  injections: many(injections),
  bloodTests: many(bloodTests),
  progressPhotos: many(progressPhotos),
}));

export const courseCompoundsRelations = relations(courseCompounds, ({ one }) => ({
  course: one(courses, {
    fields: [courseCompounds.courseId],
    references: [courses.id],
  }),
}));

export const injectionsRelations = relations(injections, ({ one }) => ({
  user: one(users, {
    fields: [injections.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [injections.courseId],
    references: [courses.id],
  }),
}));

export const bloodTestsRelations = relations(bloodTests, ({ one }) => ({
  user: one(users, {
    fields: [bloodTests.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [bloodTests.courseId],
    references: [courses.id],
  }),
}));

export const progressPhotosRelations = relations(progressPhotos, ({ one }) => ({
  user: one(users, {
    fields: [progressPhotos.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [progressPhotos.courseId],
    references: [courses.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseCompoundSchema = createInsertSchema(courseCompounds).omit({
  id: true,
  createdAt: true,
});

export const insertInjectionSchema = createInsertSchema(injections).omit({
  id: true,
  createdAt: true,
});

export const insertBloodTestSchema = createInsertSchema(bloodTests).omit({
  id: true,
  createdAt: true,
});

export const insertProgressPhotoSchema = createInsertSchema(progressPhotos).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourseCompound = z.infer<typeof insertCourseCompoundSchema>;
export type CourseCompound = typeof courseCompounds.$inferSelect;
export type InsertInjection = z.infer<typeof insertInjectionSchema>;
export type Injection = typeof injections.$inferSelect;
export type InsertBloodTest = z.infer<typeof insertBloodTestSchema>;
export type BloodTest = typeof bloodTests.$inferSelect;
export type InsertProgressPhoto = z.infer<typeof insertProgressPhotoSchema>;
export type ProgressPhoto = typeof progressPhotos.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;
