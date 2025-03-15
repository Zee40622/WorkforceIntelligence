import {
  User, InsertUser, users,
  Employee, InsertEmployee, employees,
  Document, InsertDocument, documents,
  Attendance, InsertAttendance, attendance,
  Leave, InsertLeave, leaves,
  Payroll, InsertPayroll, payroll,
  Performance, InsertPerformance, performance,
  Activity, InsertActivity, activities,
  Task, InsertTask, tasks,
  Announcement, InsertAnnouncement, announcements,
  Event, InsertEvent, events
} from "@shared/schema";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Employee operations
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByUserId(userId: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByEmployeeId(employeeId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Attendance operations
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]>;
  getAttendanceByDate(date: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  
  // Leave operations
  getLeave(id: number): Promise<Leave | undefined>;
  getLeavesByEmployeeId(employeeId: number): Promise<Leave[]>;
  createLeave(leave: InsertLeave): Promise<Leave>;
  updateLeaveStatus(id: number, status: 'pending' | 'approved' | 'rejected', approvedBy?: number): Promise<Leave | undefined>;
  
  // Payroll operations
  getPayroll(id: number): Promise<Payroll | undefined>;
  getPayrollsByEmployeeId(employeeId: number): Promise<Payroll[]>;
  createPayroll(payroll: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payroll: Partial<InsertPayroll>): Promise<Payroll | undefined>;
  
  // Performance operations
  getPerformance(id: number): Promise<Performance | undefined>;
  getPerformancesByEmployeeId(employeeId: number): Promise<Performance[]>;
  createPerformance(performance: InsertPerformance): Promise<Performance>;
  updatePerformance(id: number, performance: Partial<InsertPerformance>): Promise<Performance | undefined>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByEmployeeId(employeeId: number): Promise<Activity[]>;
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivityStatus(id: number, status: 'pending' | 'in_progress' | 'completed' | 'rejected'): Promise<Activity | undefined>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  toggleTaskCompletion(id: number): Promise<Task | undefined>;
  
  // Announcement operations
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
  getRecentAnnouncements(limit: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(limit: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private employees: Map<number, Employee>;
  private documents: Map<number, Document>;
  private attendances: Map<number, Attendance>;
  private leaves: Map<number, Leave>;
  private payrolls: Map<number, Payroll>;
  private performances: Map<number, Performance>;
  private activities: Map<number, Activity>;
  private tasks: Map<number, Task>;
  private announcements: Map<number, Announcement>;
  private events: Map<number, Event>;

  // ID counters for each entity
  private userId: number;
  private employeeId: number;
  private documentId: number;
  private attendanceId: number;
  private leaveId: number;
  private payrollId: number;
  private performanceId: number;
  private activityId: number;
  private taskId: number;
  private announcementId: number;
  private eventId: number;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.documents = new Map();
    this.attendances = new Map();
    this.leaves = new Map();
    this.payrolls = new Map();
    this.performances = new Map();
    this.activities = new Map();
    this.tasks = new Map();
    this.announcements = new Map();
    this.events = new Map();

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

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@company.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    };
    this.createUser(adminUser);

    // Create HR manager
    const hrUser: InsertUser = {
      username: "hrmanager",
      password: "hr123", // In a real app, this would be hashed
      email: "hr@company.com",
      firstName: "HR",
      lastName: "Manager",
      role: "hr"
    };
    this.createUser(hrUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Employee operations
  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByUserId(userId: number): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.userId === userId,
    );
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.employeeId++;
    const now = new Date();
    const employee: Employee = { ...insertEmployee, id, createdAt: now, updatedAt: now };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: number, data: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = await this.getEmployee(id);
    if (!employee) return undefined;

    const updatedEmployee: Employee = {
      ...employee,
      ...data,
      updatedAt: new Date()
    };

    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByEmployeeId(employeeId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.employeeId === employeeId,
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const uploadDate = new Date();
    const document: Document = { ...insertDocument, id, uploadDate };
    this.documents.set(id, document);
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Attendance operations
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendances.get(id);
  }

  async getAttendanceByEmployeeId(employeeId: number): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      (attendance) => attendance.employeeId === employeeId,
    );
  }

  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    const dateStr = date.toISOString().split('T')[0];
    return Array.from(this.attendances.values()).filter(
      (attendance) => attendance.date.toISOString().split('T')[0] === dateStr,
    );
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceId++;
    const attendance: Attendance = { ...insertAttendance, id };
    this.attendances.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, data: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = await this.getAttendance(id);
    if (!attendance) return undefined;

    const updatedAttendance: Attendance = { ...attendance, ...data };
    this.attendances.set(id, updatedAttendance);
    return updatedAttendance;
  }

  // Leave operations
  async getLeave(id: number): Promise<Leave | undefined> {
    return this.leaves.get(id);
  }

  async getLeavesByEmployeeId(employeeId: number): Promise<Leave[]> {
    return Array.from(this.leaves.values()).filter(
      (leave) => leave.employeeId === employeeId,
    );
  }

  async createLeave(insertLeave: InsertLeave): Promise<Leave> {
    const id = this.leaveId++;
    const now = new Date();
    const leave: Leave = { ...insertLeave, id, createdAt: now, updatedAt: now };
    this.leaves.set(id, leave);
    return leave;
  }

  async updateLeaveStatus(id: number, status: 'pending' | 'approved' | 'rejected', approvedBy?: number): Promise<Leave | undefined> {
    const leave = await this.getLeave(id);
    if (!leave) return undefined;

    const updatedLeave: Leave = { 
      ...leave, 
      status, 
      approvedBy, 
      updatedAt: new Date() 
    };
    
    this.leaves.set(id, updatedLeave);
    return updatedLeave;
  }

  // Payroll operations
  async getPayroll(id: number): Promise<Payroll | undefined> {
    return this.payrolls.get(id);
  }

  async getPayrollsByEmployeeId(employeeId: number): Promise<Payroll[]> {
    return Array.from(this.payrolls.values()).filter(
      (payroll) => payroll.employeeId === employeeId,
    );
  }

  async createPayroll(insertPayroll: InsertPayroll): Promise<Payroll> {
    const id = this.payrollId++;
    const payroll: Payroll = { ...insertPayroll, id };
    this.payrolls.set(id, payroll);
    return payroll;
  }

  async updatePayroll(id: number, data: Partial<InsertPayroll>): Promise<Payroll | undefined> {
    const payroll = await this.getPayroll(id);
    if (!payroll) return undefined;

    const updatedPayroll: Payroll = { ...payroll, ...data };
    this.payrolls.set(id, updatedPayroll);
    return updatedPayroll;
  }

  // Performance operations
  async getPerformance(id: number): Promise<Performance | undefined> {
    return this.performances.get(id);
  }

  async getPerformancesByEmployeeId(employeeId: number): Promise<Performance[]> {
    return Array.from(this.performances.values()).filter(
      (performance) => performance.employeeId === employeeId,
    );
  }

  async createPerformance(insertPerformance: InsertPerformance): Promise<Performance> {
    const id = this.performanceId++;
    const now = new Date();
    const performance: Performance = { ...insertPerformance, id, createdAt: now, updatedAt: now };
    this.performances.set(id, performance);
    return performance;
  }

  async updatePerformance(id: number, data: Partial<InsertPerformance>): Promise<Performance | undefined> {
    const performance = await this.getPerformance(id);
    if (!performance) return undefined;

    const updatedPerformance: Performance = { 
      ...performance, 
      ...data, 
      updatedAt: new Date() 
    };
    
    this.performances.set(id, updatedPerformance);
    return updatedPerformance;
  }

  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async getActivitiesByEmployeeId(employeeId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.employeeId === employeeId,
    );
  }

  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const date = new Date();
    const activity: Activity = { ...insertActivity, id, date };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivityStatus(id: number, status: 'pending' | 'in_progress' | 'completed' | 'rejected'): Promise<Activity | undefined> {
    const activity = await this.getActivity(id);
    if (!activity) return undefined;

    const updatedActivity: Activity = { ...activity, status };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId,
    );
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const now = new Date();
    const task: Task = { ...insertTask, id, createdAt: now, updatedAt: now };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, data: Partial<InsertTask>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;

    const updatedTask: Task = { 
      ...task, 
      ...data, 
      updatedAt: new Date() 
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async toggleTaskCompletion(id: number): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;

    const updatedTask: Task = { 
      ...task, 
      completed: !task.completed, 
      updatedAt: new Date() 
    };
    
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Announcement operations
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async getRecentAnnouncements(limit: number): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => b.postDate.getTime() - a.postDate.getTime())
      .slice(0, limit);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementId++;
    const postDate = new Date();
    const announcement: Announcement = { ...insertAnnouncement, id, postDate };
    this.announcements.set(id, announcement);
    return announcement;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getUpcomingEvents(limit: number): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => event.startDate > now)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, limit);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const createdAt = new Date();
    const event: Event = { ...insertEvent, id, createdAt };
    this.events.set(id, event);
    return event;
  }
}

export const storage = new MemStorage();
