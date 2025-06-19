import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCourseSchema,
  insertCourseCompoundSchema,
  insertInjectionSchema,
  insertBloodTestSchema,
  insertProgressPhotoSchema,
} from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Create uploads directory if it doesn't exist
  import("fs").then((fs) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Development authentication middleware
  const isDevelopment = process.env.NODE_ENV === "development";
  const devAuth = async (req: any, res: any, next: any) => {
    if (isDevelopment) {
      const mockUserId = "dev-user-123";
      let user = await storage.getUser(mockUserId);
      
      if (!user) {
        user = await storage.upsertUser({
          id: mockUserId,
          email: "dev@example.com",
          firstName: "Dev",
          lastName: "User",
          profileImageUrl: null,
          level: 1,
          xp: 0,
        });
      }
      
      // Mock the user object structure expected by routes
      req.user = {
        claims: { sub: mockUserId }
      };
      next();
    } else {
      isAuthenticated(req, res, next);
    }
  };
  
  // Auth routes
  app.get("/api/auth/user", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Recent activity
  app.get("/api/dashboard/activity", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recentInjections = await storage.getUserInjections(userId, 5);
      const recentBloodTests = await storage.getUserBloodTests(userId);
      const recentPhotos = await storage.getUserProgressPhotos(userId);

      // Combine and sort by date
      const activities = [
        ...recentInjections.map(inj => ({
          id: `injection-${inj.id}`,
          type: "injection",
          title: `${inj.compoundName} ${inj.dosageAmount}${inj.dosageUnit}`,
          description: `Injection in ${inj.injectionSite}`,
          date: inj.injectionDate,
          xp: inj.xpEarned,
          icon: "syringe",
          color: "health-green",
        })),
        ...recentBloodTests.slice(0, 3).map(test => ({
          id: `bloodtest-${test.id}`,
          type: "bloodtest",
          title: "Blood Test Results",
          description: test.testType.replace("_", " "),
          date: new Date(test.testDate),
          xp: test.xpEarned,
          icon: "vial",
          color: "energy-orange",
        })),
        ...recentPhotos.slice(0, 3).map(photo => ({
          id: `photo-${photo.id}`,
          type: "photo",
          title: "Progress Photo",
          description: `${photo.bodyPart} photo`,
          date: photo.createdAt,
          xp: photo.xpEarned,
          icon: "camera",
          color: "medical-blue",
        })),
      ].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 10);

      res.json(activities);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // Course routes
  app.get("/api/courses", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courses = await storage.getUserCourses(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseData = insertCourseSchema.parse({ ...req.body, userId });
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(400).json({ message: "Failed to create course" });
    }
  });

  app.get("/api/courses/:id", devAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const compounds = await storage.getCourseCompounds(courseId);
      res.json({ ...course, compounds });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Course compounds
  app.post("/api/courses/:id/compounds", devAuth, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const compoundData = insertCourseCompoundSchema.parse({ ...req.body, courseId });
      const compound = await storage.createCourseCompound(compoundData);
      res.json(compound);
    } catch (error) {
      console.error("Error creating compound:", error);
      res.status(400).json({ message: "Failed to create compound" });
    }
  });

  // Injection routes
  app.get("/api/injections", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const injections = await storage.getUserInjections(userId);
      res.json(injections);
    } catch (error) {
      console.error("Error fetching injections:", error);
      res.status(500).json({ message: "Failed to fetch injections" });
    }
  });

  app.post("/api/injections", devAuth, upload.single("photo"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const injectionData = insertInjectionSchema.parse({
        ...req.body,
        userId,
        dosageAmount: parseFloat(req.body.dosageAmount),
        painLevel: req.body.painLevel ? parseInt(req.body.painLevel) : null,
        courseId: req.body.courseId ? parseInt(req.body.courseId) : null,
        injectionDate: new Date(req.body.injectionDate || Date.now()),
        photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });
      
      const injection = await storage.createInjection(injectionData);
      res.json(injection);
    } catch (error) {
      console.error("Error creating injection:", error);
      res.status(400).json({ message: "Failed to create injection" });
    }
  });

  // Blood test routes
  app.get("/api/blood-tests", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bloodTests = await storage.getUserBloodTests(userId);
      res.json(bloodTests);
    } catch (error) {
      console.error("Error fetching blood tests:", error);
      res.status(500).json({ message: "Failed to fetch blood tests" });
    }
  });

  app.post("/api/blood-tests", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bloodTestData = insertBloodTestSchema.parse({
        ...req.body,
        userId,
        courseId: req.body.courseId ? parseInt(req.body.courseId) : null,
        testDate: new Date(req.body.testDate),
      });
      
      const bloodTest = await storage.createBloodTest(bloodTestData);
      res.json(bloodTest);
    } catch (error) {
      console.error("Error creating blood test:", error);
      res.status(400).json({ message: "Failed to create blood test" });
    }
  });

  // Progress photo routes
  app.get("/api/progress-photos", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const photos = await storage.getUserProgressPhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching progress photos:", error);
      res.status(500).json({ message: "Failed to fetch progress photos" });
    }
  });

  app.post("/api/progress-photos", devAuth, upload.single("photo"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      if (!req.file) {
        return res.status(400).json({ message: "Photo file is required" });
      }
      
      const photoData = insertProgressPhotoSchema.parse({
        ...req.body,
        userId,
        courseId: req.body.courseId ? parseInt(req.body.courseId) : null,
        weight: req.body.weight ? parseFloat(req.body.weight) : null,
        bodyFat: req.body.bodyFat ? parseFloat(req.body.bodyFat) : null,
        photoUrl: `/uploads/${req.file.filename}`,
      });
      
      const photo = await storage.createProgressPhoto(photoData);
      res.json(photo);
    } catch (error) {
      console.error("Error creating progress photo:", error);
      res.status(400).json({ message: "Failed to create progress photo" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", devAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
