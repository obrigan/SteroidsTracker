import {
  users,
  courses,
  courseCompounds,
  injections,
  bloodTests,
  progressPhotos,
  achievements,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type CourseCompound,
  type InsertCourseCompound,
  type Injection,
  type InsertInjection,
  type BloodTest,
  type InsertBloodTest,
  type ProgressPhoto,
  type InsertProgressPhoto,
  type Achievement,
  type InsertAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Course operations
  getUserCourses(userId: string): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // Course compound operations
  getCourseCompounds(courseId: number): Promise<CourseCompound[]>;
  createCourseCompound(compound: InsertCourseCompound): Promise<CourseCompound>;
  
  // Injection operations
  getUserInjections(userId: string, limit?: number): Promise<Injection[]>;
  createInjection(injection: InsertInjection): Promise<Injection>;
  
  // Blood test operations
  getUserBloodTests(userId: string): Promise<BloodTest[]>;
  createBloodTest(bloodTest: InsertBloodTest): Promise<BloodTest>;
  
  // Progress photo operations
  getUserProgressPhotos(userId: string): Promise<ProgressPhoto[]>;
  createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto>;
  
  // Achievement operations
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Stats operations
  getUserStats(userId: string): Promise<{
    activeCourses: number;
    totalInjections: number;
    totalBloodTests: number;
    totalPhotos: number;
    currentStreak: number;
    level: number;
    xp: number;
  }>;
  
  // Update user XP and level
  updateUserXP(userId: string, xpToAdd: number): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Course operations
  async getUserCourses(userId: string): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.userId, userId))
      .orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    
    // Update user total courses count
    await db.update(users)
      .set({ 
        totalCourses: sql`${users.totalCourses} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(users.id, course.userId));
    
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Course compound operations
  async getCourseCompounds(courseId: number): Promise<CourseCompound[]> {
    return db.select().from(courseCompounds)
      .where(eq(courseCompounds.courseId, courseId));
  }

  async createCourseCompound(compound: InsertCourseCompound): Promise<CourseCompound> {
    const [newCompound] = await db.insert(courseCompounds).values(compound).returning();
    return newCompound;
  }

  // Injection operations
  async getUserInjections(userId: string, limit = 50): Promise<Injection[]> {
    return db.select().from(injections)
      .where(eq(injections.userId, userId))
      .orderBy(desc(injections.injectionDate))
      .limit(limit);
  }

  async createInjection(injection: InsertInjection): Promise<Injection> {
    const [newInjection] = await db.insert(injections).values(injection).returning();
    
    // Update user stats and XP
    await this.updateUserXP(injection.userId, injection.xpEarned || 15);
    await db.update(users)
      .set({ 
        totalInjections: sql`${users.totalInjections} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(users.id, injection.userId));
    
    return newInjection;
  }

  // Blood test operations
  async getUserBloodTests(userId: string): Promise<BloodTest[]> {
    return db.select().from(bloodTests)
      .where(eq(bloodTests.userId, userId))
      .orderBy(desc(bloodTests.testDate));
  }

  async createBloodTest(bloodTest: InsertBloodTest): Promise<BloodTest> {
    const [newBloodTest] = await db.insert(bloodTests).values(bloodTest).returning();
    
    // Update user stats and XP
    await this.updateUserXP(bloodTest.userId, bloodTest.xpEarned || 25);
    await db.update(users)
      .set({ 
        totalBloodTests: sql`${users.totalBloodTests} + 1`,
        updatedAt: new Date() 
      })
      .where(eq(users.id, bloodTest.userId));
    
    return newBloodTest;
  }

  // Progress photo operations
  async getUserProgressPhotos(userId: string): Promise<ProgressPhoto[]> {
    return db.select().from(progressPhotos)
      .where(eq(progressPhotos.userId, userId))
      .orderBy(desc(progressPhotos.createdAt));
  }

  async createProgressPhoto(photo: InsertProgressPhoto): Promise<ProgressPhoto> {
    const [newPhoto] = await db.insert(progressPhotos).values(photo).returning();
    
    // Update user XP
    await this.updateUserXP(photo.userId, photo.xpEarned || 10);
    
    return newPhoto;
  }

  // Achievement operations
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return db.select().from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    
    // Update user XP if achievement has reward
    if (achievement.xpReward && achievement.xpReward > 0) {
      await this.updateUserXP(achievement.userId, achievement.xpReward);
    }
    
    return newAchievement;
  }

  // Stats operations
  async getUserStats(userId: string): Promise<{
    activeCourses: number;
    totalInjections: number;
    totalBloodTests: number;
    totalPhotos: number;
    currentStreak: number;
    level: number;
    xp: number;
  }> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const [activeCourses] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(and(eq(courses.userId, userId), eq(courses.status, "active")));

    const [totalPhotos] = await db
      .select({ count: sql<number>`count(*)` })
      .from(progressPhotos)
      .where(eq(progressPhotos.userId, userId));

    return {
      activeCourses: Number(activeCourses.count),
      totalInjections: user.totalInjections || 0,
      totalBloodTests: user.totalBloodTests || 0,
      totalPhotos: Number(totalPhotos.count),
      currentStreak: user.currentStreak || 0,
      level: user.level || 1,
      xp: user.xp || 0,
    };
  }

  // Update user XP and level
  async updateUserXP(userId: string, xpToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newXP = (user.xp || 0) + xpToAdd;
    const newLevel = Math.floor(newXP / 300) + 1; // 300 XP per level

    const [updatedUser] = await db
      .update(users)
      .set({
        xp: newXP,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    // Check for level up achievement
    if (newLevel > (user.level || 1)) {
      await this.createAchievement({
        userId,
        achievementType: "level_up",
        achievementName: `Level ${newLevel} Reached!`,
        description: `Congratulations on reaching level ${newLevel}!`,
        iconUrl: "🎉",
        xpReward: 0, // No XP reward to avoid infinite loop
      });
    }

    return updatedUser;
  }
}

export const storage = new DatabaseStorage();
