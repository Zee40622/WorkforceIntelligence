import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum definitions
export const employmentTypeEnum = pgEnum('employment_type', ['full_time', 'part_time', 'contract', 'intern']);
export const departmentEnum = pgEnum('department', ['engineering', 'marketing', 'sales', 'hr', 'finance', 'operations', 'other']);
export const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected']);
export const leaveTypeEnum = pgEnum('leave_type', ['annual', 'sick', 'unpaid', 'maternity', 'paternity', 'bereavement', 'other']);
export const activityTypeEnum = pgEnum('activity_type', ['leave_request', 'document_update', 'training', 'performance_review', 'onboarding', 'other']);
export const activityStatusEnum = pgEnum('activity_status', ['pending', 'in_progress', 'completed', 'rejected']);
export const taskPriorityEnum = pgEnum('task_priority', ['urgent', 'high', 'medium', 'normal', 'low']);

// Base tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default('employee'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  path: text("path").notNull(),
  metadata: text("metadata"), // Store additional document information as JSON string
  uploadDate: timestamp("upload_date").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  date: date("date").notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  status: text("status").notNull().default('present'),
  notes: text("notes"),
});

export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  type: leaveTypeEnum("type").notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").notNull().default('pending'),
  approvedBy: integer("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  period: text("period").notNull(),
  baseSalary: numeric("base_salary").notNull(),
  bonus: numeric("bonus").default('0'),
  deductions: numeric("deductions").default('0'),
  netSalary: numeric("net_salary").notNull(),
  paymentDate: date("payment_date").notNull(),
  status: text("status").notNull().default('pending'),
  notes: text("notes"),
});

export const performance = pgTable("performance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  period: text("period").notNull(),
  rating: numeric("rating"),
  comments: text("comments"),
  goals: text("goals"),
  reviewDate: date("review_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  type: activityTypeEnum("type").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").defaultNow(),
  status: activityStatusEnum("status").notNull().default('pending'),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  priority: taskPriorityEnum("priority").notNull().default('normal'),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postDate: timestamp("post_date").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadDate: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

export const insertLeaveSchema = createInsertSchema(leaves).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
});

export const insertPerformanceSchema = createInsertSchema(performance).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  date: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  postDate: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendance.$inferSelect;

export type InsertLeave = z.infer<typeof insertLeaveSchema>;
export type Leave = typeof leaves.$inferSelect;

export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type Payroll = typeof payroll.$inferSelect;

export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
export type Performance = typeof performance.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
