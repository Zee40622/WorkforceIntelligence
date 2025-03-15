import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertEmployeeSchema, 
  insertDocumentSchema, 
  insertAttendanceSchema, 
  insertLeaveSchema, 
  insertPayrollSchema, 
  insertPerformanceSchema, 
  insertActivitySchema, 
  insertTaskSchema, 
  insertAnnouncementSchema, 
  insertEventSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation errors
  const validateRequest = (schema: z.ZodTypeAny, data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }
    return result.data;
  };

  // User routes
  app.get("/api/users", async (req: Request, res: Response) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = validateRequest(insertUserSchema, req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userData = validateRequest(insertUserSchema.partial(), req.body);
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Employee routes
  app.get("/api/employees", async (req: Request, res: Response) => {
    const employees = await storage.getAllEmployees();
    res.json(employees);
  });

  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const employee = await storage.getEmployee(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  });

  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      const employeeData = validateRequest(insertEmployeeSchema, req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const employeeData = validateRequest(insertEmployeeSchema.partial(), req.body);
      const employee = await storage.updateEmployee(id, employeeData);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Document routes
  app.get("/api/employees/:employeeId/documents", async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.employeeId);
    const documents = await storage.getDocumentsByEmployeeId(employeeId);
    res.json(documents);
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = validateRequest(insertDocumentSchema, req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteDocument(id);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(204).send();
  });

  // Attendance routes
  app.get("/api/employees/:employeeId/attendance", async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.employeeId);
    const attendance = await storage.getAttendanceByEmployeeId(employeeId);
    res.json(attendance);
  });

  app.post("/api/attendance", async (req: Request, res: Response) => {
    try {
      const attendanceData = validateRequest(insertAttendanceSchema, req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/attendance/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const attendanceData = validateRequest(insertAttendanceSchema.partial(), req.body);
      const attendance = await storage.updateAttendance(id, attendanceData);
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Leave routes
  app.get("/api/employees/:employeeId/leaves", async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.employeeId);
    const leaves = await storage.getLeavesByEmployeeId(employeeId);
    res.json(leaves);
  });

  app.post("/api/leaves", async (req: Request, res: Response) => {
    try {
      const leaveData = validateRequest(insertLeaveSchema, req.body);
      const leave = await storage.createLeave(leaveData);
      res.status(201).json(leave);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/leaves/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status, approvedBy } = req.body;
      
      const statusSchema = z.enum(['pending', 'approved', 'rejected']);
      const approvedBySchema = z.number().optional();
      
      const validatedStatus = statusSchema.parse(status);
      const validatedApprovedBy = approvedBy ? approvedBySchema.parse(approvedBy) : undefined;
      
      const leave = await storage.updateLeaveStatus(id, validatedStatus, validatedApprovedBy);
      if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      res.json(leave);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Payroll routes
  app.get("/api/employees/:employeeId/payroll", async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.employeeId);
    const payroll = await storage.getPayrollsByEmployeeId(employeeId);
    res.json(payroll);
  });

  app.post("/api/payroll", async (req: Request, res: Response) => {
    try {
      const payrollData = validateRequest(insertPayrollSchema, req.body);
      const payroll = await storage.createPayroll(payrollData);
      res.status(201).json(payroll);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/payroll/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const payrollData = validateRequest(insertPayrollSchema.partial(), req.body);
      const payroll = await storage.updatePayroll(id, payrollData);
      if (!payroll) {
        return res.status(404).json({ message: "Payroll record not found" });
      }
      res.json(payroll);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Performance routes
  app.get("/api/employees/:employeeId/performance", async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.employeeId);
    const performances = await storage.getPerformancesByEmployeeId(employeeId);
    res.json(performances);
  });

  app.post("/api/performance", async (req: Request, res: Response) => {
    try {
      const performanceData = validateRequest(insertPerformanceSchema, req.body);
      const performance = await storage.createPerformance(performanceData);
      res.status(201).json(performance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/performance/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const performanceData = validateRequest(insertPerformanceSchema.partial(), req.body);
      const performance = await storage.updatePerformance(id, performanceData);
      if (!performance) {
        return res.status(404).json({ message: "Performance record not found" });
      }
      res.json(performance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Activity routes
  app.get("/api/activities/recent", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const activities = await storage.getRecentActivities(limit);
    res.json(activities);
  });

  app.get("/api/employees/:employeeId/activities", async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.employeeId);
    const activities = await storage.getActivitiesByEmployeeId(employeeId);
    res.json(activities);
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = validateRequest(insertActivitySchema, req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/activities/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const statusSchema = z.enum(['pending', 'in_progress', 'completed', 'rejected']);
      const validatedStatus = statusSchema.parse(status);
      
      const activity = await storage.updateActivityStatus(id, validatedStatus);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Task routes
  app.get("/api/users/:userId/tasks", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const tasks = await storage.getTasksByUserId(userId);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const taskData = validateRequest(insertTaskSchema, req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = validateRequest(insertTaskSchema.partial(), req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/tasks/:id/toggle", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.toggleTaskCompletion(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Announcement routes
  app.get("/api/announcements", async (req: Request, res: Response) => {
    const announcements = await storage.getAllAnnouncements();
    res.json(announcements);
  });

  app.get("/api/announcements/recent", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const announcements = await storage.getRecentAnnouncements(limit);
    res.json(announcements);
  });

  app.post("/api/announcements", async (req: Request, res: Response) => {
    try {
      const announcementData = validateRequest(insertAnnouncementSchema, req.body);
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Event routes
  app.get("/api/events", async (req: Request, res: Response) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });

  app.get("/api/events/upcoming", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const events = await storage.getUpcomingEvents(limit);
    res.json(events);
  });

  app.post("/api/events", async (req: Request, res: Response) => {
    try {
      const eventData = validateRequest(insertEventSchema, req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
