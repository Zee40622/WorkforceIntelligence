// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  employees;
  documents;
  attendances;
  leaves;
  payrolls;
  performances;
  activities;
  tasks;
  announcements;
  events;
  // ID counters for each entity
  userId;
  employeeId;
  documentId;
  attendanceId;
  leaveId;
  payrollId;
  performanceId;
  activityId;
  taskId;
  announcementId;
  eventId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.employees = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Map();
    this.attendances = /* @__PURE__ */ new Map();
    this.leaves = /* @__PURE__ */ new Map();
    this.payrolls = /* @__PURE__ */ new Map();
    this.performances = /* @__PURE__ */ new Map();
    this.activities = /* @__PURE__ */ new Map();
    this.tasks = /* @__PURE__ */ new Map();
    this.announcements = /* @__PURE__ */ new Map();
    this.events = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.employeeId = 1;
    this.documentId = 1;
    this.attendanceId = 1;
    this.leaveId = 1;
    this.payrollId = 1;
    this.performanceId = 1;
    this.activityId = 1;
    this.taskId = 1;
    this.announcementId = 1;
    this.eventId = 1;
    this.initializeSampleData();
  }
  initializeSampleData() {
    const adminUser = {
      username: "admin",
      password: "admin123",
      // In a real app, this would be hashed
      email: "admin@company.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    };
    this.createUser(adminUser);
    const hrUser = {
      username: "hrmanager",
      password: "hr123",
      // In a real app, this would be hashed
      email: "hr@company.com",
      firstName: "HR",
      lastName: "Manager",
      role: "hr"
    };
    this.createUser(hrUser);
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, data) {
    const user = await this.getUser(id);
    if (!user) return void 0;
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  // Employee operations
  async getEmployee(id) {
    return this.employees.get(id);
  }
  async getEmployeeByUserId(userId) {
    return Array.from(this.employees.values()).find(
      (employee) => employee.userId === userId
    );
  }
  async createEmployee(insertEmployee) {
    const id = this.employeeId++;
    const now = /* @__PURE__ */ new Date();
    const employee = { ...insertEmployee, id, createdAt: now, updatedAt: now };
    this.employees.set(id, employee);
    return employee;
  }
  async updateEmployee(id, data) {
    const employee = await this.getEmployee(id);
    if (!employee) return void 0;
    const updatedEmployee = {
      ...employee,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }
  async getAllEmployees() {
    return Array.from(this.employees.values());
  }
  // Document operations
  async getDocument(id) {
    return this.documents.get(id);
  }
  async getDocumentsByEmployeeId(employeeId) {
    return Array.from(this.documents.values()).filter(
      (document) => document.employeeId === employeeId
    );
  }
  async createDocument(insertDocument) {
    const id = this.documentId++;
    const uploadDate = /* @__PURE__ */ new Date();
    const document = { ...insertDocument, id, uploadDate };
    this.documents.set(id, document);
    return document;
  }
  async deleteDocument(id) {
    return this.documents.delete(id);
  }
  // Attendance operations
  async getAttendance(id) {
    return this.attendances.get(id);
  }
  async getAttendanceByEmployeeId(employeeId) {
    return Array.from(this.attendances.values()).filter(
      (attendance2) => attendance2.employeeId === employeeId
    );
  }
  async getAttendanceByDate(date2) {
    const dateStr = date2.toISOString().split("T")[0];
    return Array.from(this.attendances.values()).filter(
      (attendance2) => attendance2.date.toISOString().split("T")[0] === dateStr
    );
  }
  async createAttendance(insertAttendance) {
    const id = this.attendanceId++;
    const attendance2 = { ...insertAttendance, id };
    this.attendances.set(id, attendance2);
    return attendance2;
  }
  async updateAttendance(id, data) {
    const attendance2 = await this.getAttendance(id);
    if (!attendance2) return void 0;
    const updatedAttendance = { ...attendance2, ...data };
    this.attendances.set(id, updatedAttendance);
    return updatedAttendance;
  }
  // Leave operations
  async getLeave(id) {
    return this.leaves.get(id);
  }
  async getLeavesByEmployeeId(employeeId) {
    return Array.from(this.leaves.values()).filter(
      (leave) => leave.employeeId === employeeId
    );
  }
  async createLeave(insertLeave) {
    const id = this.leaveId++;
    const now = /* @__PURE__ */ new Date();
    const leave = { ...insertLeave, id, createdAt: now, updatedAt: now };
    this.leaves.set(id, leave);
    return leave;
  }
  async updateLeaveStatus(id, status, approvedBy) {
    const leave = await this.getLeave(id);
    if (!leave) return void 0;
    const updatedLeave = {
      ...leave,
      status,
      approvedBy,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.leaves.set(id, updatedLeave);
    return updatedLeave;
  }
  // Payroll operations
  async getPayroll(id) {
    return this.payrolls.get(id);
  }
  async getPayrollsByEmployeeId(employeeId) {
    return Array.from(this.payrolls.values()).filter(
      (payroll2) => payroll2.employeeId === employeeId
    );
  }
  async createPayroll(insertPayroll) {
    const id = this.payrollId++;
    const payroll2 = { ...insertPayroll, id };
    this.payrolls.set(id, payroll2);
    return payroll2;
  }
  async updatePayroll(id, data) {
    const payroll2 = await this.getPayroll(id);
    if (!payroll2) return void 0;
    const updatedPayroll = { ...payroll2, ...data };
    this.payrolls.set(id, updatedPayroll);
    return updatedPayroll;
  }
  // Performance operations
  async getPerformance(id) {
    return this.performances.get(id);
  }
  async getPerformancesByEmployeeId(employeeId) {
    return Array.from(this.performances.values()).filter(
      (performance2) => performance2.employeeId === employeeId
    );
  }
  async createPerformance(insertPerformance) {
    const id = this.performanceId++;
    const now = /* @__PURE__ */ new Date();
    const performance2 = { ...insertPerformance, id, createdAt: now, updatedAt: now };
    this.performances.set(id, performance2);
    return performance2;
  }
  async updatePerformance(id, data) {
    const performance2 = await this.getPerformance(id);
    if (!performance2) return void 0;
    const updatedPerformance = {
      ...performance2,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.performances.set(id, updatedPerformance);
    return updatedPerformance;
  }
  // Activity operations
  async getActivity(id) {
    return this.activities.get(id);
  }
  async getActivitiesByEmployeeId(employeeId) {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.employeeId === employeeId
    );
  }
  async getRecentActivities(limit) {
    return Array.from(this.activities.values()).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
  }
  async createActivity(insertActivity) {
    const id = this.activityId++;
    const date2 = /* @__PURE__ */ new Date();
    const activity = { ...insertActivity, id, date: date2 };
    this.activities.set(id, activity);
    return activity;
  }
  async updateActivityStatus(id, status) {
    const activity = await this.getActivity(id);
    if (!activity) return void 0;
    const updatedActivity = { ...activity, status };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }
  // Task operations
  async getTask(id) {
    return this.tasks.get(id);
  }
  async getTasksByUserId(userId) {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }
  async createTask(insertTask) {
    const id = this.taskId++;
    const now = /* @__PURE__ */ new Date();
    const task = { ...insertTask, id, createdAt: now, updatedAt: now };
    this.tasks.set(id, task);
    return task;
  }
  async updateTask(id, data) {
    const task = await this.getTask(id);
    if (!task) return void 0;
    const updatedTask = {
      ...task,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  async toggleTaskCompletion(id) {
    const task = await this.getTask(id);
    if (!task) return void 0;
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  // Announcement operations
  async getAnnouncement(id) {
    return this.announcements.get(id);
  }
  async getAllAnnouncements() {
    return Array.from(this.announcements.values());
  }
  async getRecentAnnouncements(limit) {
    return Array.from(this.announcements.values()).sort((a, b) => b.postDate.getTime() - a.postDate.getTime()).slice(0, limit);
  }
  async createAnnouncement(insertAnnouncement) {
    const id = this.announcementId++;
    const postDate = /* @__PURE__ */ new Date();
    const announcement = { ...insertAnnouncement, id, postDate };
    this.announcements.set(id, announcement);
    return announcement;
  }
  // Event operations
  async getEvent(id) {
    return this.events.get(id);
  }
  async getAllEvents() {
    return Array.from(this.events.values());
  }
  async getUpcomingEvents(limit) {
    const now = /* @__PURE__ */ new Date();
    return Array.from(this.events.values()).filter((event) => event.startDate > now).sort((a, b) => a.startDate.getTime() - b.startDate.getTime()).slice(0, limit);
  }
  async createEvent(insertEvent) {
    const id = this.eventId++;
    const createdAt = /* @__PURE__ */ new Date();
    const event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var employmentTypeEnum = pgEnum("employment_type", ["full_time", "part_time", "contract", "intern"]);
var departmentEnum = pgEnum("department", ["engineering", "marketing", "sales", "hr", "finance", "operations", "other"]);
var leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "rejected"]);
var leaveTypeEnum = pgEnum("leave_type", ["annual", "sick", "unpaid", "maternity", "paternity", "bereavement", "other"]);
var activityTypeEnum = pgEnum("activity_type", ["leave_request", "document_update", "training", "performance_review", "onboarding", "other"]);
var activityStatusEnum = pgEnum("activity_status", ["pending", "in_progress", "completed", "rejected"]);
var taskPriorityEnum = pgEnum("task_priority", ["urgent", "high", "medium", "normal", "low"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("employee"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeId: text("employee_id").notNull().unique(),
  dateOfBirth: date("date_of_birth"),
  hireDate: date("hire_date").notNull(),
  department: departmentEnum("department").notNull(),
  position: text("position").notNull(),
  employmentType: employmentTypeEnum("employment_type").notNull(),
  manager: integer("manager_id").references(() => employees.id),
  phone: text("phone"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  salary: numeric("salary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  path: text("path").notNull(),
  metadata: text("metadata"),
  // Store additional document information as JSON string
  uploadDate: timestamp("upload_date").defaultNow()
});
var attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  date: date("date").notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  status: text("status").notNull().default("present"),
  notes: text("notes")
});
var leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  type: leaveTypeEnum("type").notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").notNull().default("pending"),
  approvedBy: integer("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  period: text("period").notNull(),
  baseSalary: numeric("base_salary").notNull(),
  bonus: numeric("bonus").default("0"),
  deductions: numeric("deductions").default("0"),
  netSalary: numeric("net_salary").notNull(),
  paymentDate: date("payment_date").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes")
});
var performance = pgTable("performance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  period: text("period").notNull(),
  rating: numeric("rating"),
  comments: text("comments"),
  goals: text("goals"),
  reviewDate: date("review_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  type: activityTypeEnum("type").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow(),
  status: activityStatusEnum("status").notNull().default("pending")
});
var tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  priority: taskPriorityEnum("priority").notNull().default("normal"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postDate: timestamp("post_date").defaultNow()
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadDate: true
});
var insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true
});
var insertLeaveSchema = createInsertSchema(leaves).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true
});
var insertPerformanceSchema = createInsertSchema(performance).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  date: true
});
var insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  postDate: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  const validateRequest = (schema, data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const validationError = fromZodError(result.error);
      throw new Error(validationError.message);
    }
    return result.data;
  };
  app2.get("/api/users", async (req, res) => {
    const users2 = await storage.getAllUsers();
    res.json(users2);
  });
  app2.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = validateRequest(insertUserSchema, req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = validateRequest(insertUserSchema.partial(), req.body);
      const user = await storage.updateUser(id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/employees", async (req, res) => {
    const employees2 = await storage.getAllEmployees();
    res.json(employees2);
  });
  app2.get("/api/employees/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const employee = await storage.getEmployee(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  });
  app2.post("/api/employees", async (req, res) => {
    try {
      const employeeData = validateRequest(insertEmployeeSchema, req.body);
      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/employees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employeeData = validateRequest(insertEmployeeSchema.partial(), req.body);
      const employee = await storage.updateEmployee(id, employeeData);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/employees/:employeeId/documents", async (req, res) => {
    const employeeId = parseInt(req.params.employeeId);
    const documents2 = await storage.getDocumentsByEmployeeId(employeeId);
    res.json(documents2);
  });
  app2.post("/api/documents", async (req, res) => {
    try {
      const documentData = validateRequest(insertDocumentSchema, req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteDocument(id);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(204).send();
  });
  app2.get("/api/employees/:employeeId/attendance", async (req, res) => {
    const employeeId = parseInt(req.params.employeeId);
    const attendance2 = await storage.getAttendanceByEmployeeId(employeeId);
    res.json(attendance2);
  });
  app2.post("/api/attendance", async (req, res) => {
    try {
      const attendanceData = validateRequest(insertAttendanceSchema, req.body);
      const attendance2 = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/attendance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const attendanceData = validateRequest(insertAttendanceSchema.partial(), req.body);
      const attendance2 = await storage.updateAttendance(id, attendanceData);
      if (!attendance2) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
      res.json(attendance2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/employees/:employeeId/leaves", async (req, res) => {
    const employeeId = parseInt(req.params.employeeId);
    const leaves2 = await storage.getLeavesByEmployeeId(employeeId);
    res.json(leaves2);
  });
  app2.post("/api/leaves", async (req, res) => {
    try {
      const leaveData = validateRequest(insertLeaveSchema, req.body);
      const leave = await storage.createLeave(leaveData);
      res.status(201).json(leave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/leaves/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, approvedBy } = req.body;
      const statusSchema = z.enum(["pending", "approved", "rejected"]);
      const approvedBySchema = z.number().optional();
      const validatedStatus = statusSchema.parse(status);
      const validatedApprovedBy = approvedBy ? approvedBySchema.parse(approvedBy) : void 0;
      const leave = await storage.updateLeaveStatus(id, validatedStatus, validatedApprovedBy);
      if (!leave) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      res.json(leave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/employees/:employeeId/payroll", async (req, res) => {
    const employeeId = parseInt(req.params.employeeId);
    const payroll2 = await storage.getPayrollsByEmployeeId(employeeId);
    res.json(payroll2);
  });
  app2.post("/api/payroll", async (req, res) => {
    try {
      const payrollData = validateRequest(insertPayrollSchema, req.body);
      const payroll2 = await storage.createPayroll(payrollData);
      res.status(201).json(payroll2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/payroll/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const payrollData = validateRequest(insertPayrollSchema.partial(), req.body);
      const payroll2 = await storage.updatePayroll(id, payrollData);
      if (!payroll2) {
        return res.status(404).json({ message: "Payroll record not found" });
      }
      res.json(payroll2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/employees/:employeeId/performance", async (req, res) => {
    const employeeId = parseInt(req.params.employeeId);
    const performances = await storage.getPerformancesByEmployeeId(employeeId);
    res.json(performances);
  });
  app2.post("/api/performance", async (req, res) => {
    try {
      const performanceData = validateRequest(insertPerformanceSchema, req.body);
      const performance2 = await storage.createPerformance(performanceData);
      res.status(201).json(performance2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/performance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const performanceData = validateRequest(insertPerformanceSchema.partial(), req.body);
      const performance2 = await storage.updatePerformance(id, performanceData);
      if (!performance2) {
        return res.status(404).json({ message: "Performance record not found" });
      }
      res.json(performance2);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/activities/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const activities2 = await storage.getRecentActivities(limit);
    res.json(activities2);
  });
  app2.get("/api/employees/:employeeId/activities", async (req, res) => {
    const employeeId = parseInt(req.params.employeeId);
    const activities2 = await storage.getActivitiesByEmployeeId(employeeId);
    res.json(activities2);
  });
  app2.post("/api/activities", async (req, res) => {
    try {
      const activityData = validateRequest(insertActivitySchema, req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/activities/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const statusSchema = z.enum(["pending", "in_progress", "completed", "rejected"]);
      const validatedStatus = statusSchema.parse(status);
      const activity = await storage.updateActivityStatus(id, validatedStatus);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/users/:userId/tasks", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const tasks2 = await storage.getTasksByUserId(userId);
    res.json(tasks2);
  });
  app2.post("/api/tasks", async (req, res) => {
    try {
      const taskData = validateRequest(insertTaskSchema, req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = validateRequest(insertTaskSchema.partial(), req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/tasks/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.toggleTaskCompletion(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/announcements", async (req, res) => {
    const announcements2 = await storage.getAllAnnouncements();
    res.json(announcements2);
  });
  app2.get("/api/announcements/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const announcements2 = await storage.getRecentAnnouncements(limit);
    res.json(announcements2);
  });
  app2.post("/api/announcements", async (req, res) => {
    try {
      const announcementData = validateRequest(insertAnnouncementSchema, req.body);
      const announcement = await storage.createAnnouncement(announcementData);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/events", async (req, res) => {
    const events2 = await storage.getAllEvents();
    res.json(events2);
  });
  app2.get("/api/events/upcoming", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const events2 = await storage.getUpcomingEvents(limit);
    res.json(events2);
  });
  app2.post("/api/events", async (req, res) => {
    try {
      const eventData = validateRequest(insertEventSchema, req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
