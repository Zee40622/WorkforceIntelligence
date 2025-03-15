import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Mail,
  Send,
  Star,
  Clock,
  Trash2,
  Archive,
  AlertCircle,
  Bookmark,
  PlusCircle,
  Paperclip,
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowLeftCircle,
  Download,
  Reply,
  Forward,
  Users,
  Calendar as CalendarIcon,
  Bell,
  Pencil,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Message types for email system
type MessagePriority = "high" | "normal" | "low";
type MessageStatus = "read" | "unread";
type MessageFolder = "inbox" | "sent" | "drafts" | "starred" | "trash" | "archive";

interface EmailAttachment {
  id: number;
  filename: string;
  size: string;
  type: string;
}

interface EmailMessage {
  id: number;
  from: {
    name: string;
    email: string;
    avatar?: string;
    department?: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  cc?: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  date: string;
  time: string;
  status: MessageStatus;
  folder: MessageFolder;
  isStarred: boolean;
  priority: MessagePriority;
  labels?: string[];
  attachments?: EmailAttachment[];
  hasCalendarInvite?: boolean;
  isForwarded?: boolean;
  isReplied?: boolean;
}

// Sample email data
const emailMessages: EmailMessage[] = [
  {
    id: 1,
    from: {
      name: "John Smith",
      email: "john.smith@company.com",
      avatar: "JS",
      department: "HR Department"
    },
    to: [{ name: "Current User", email: "user@company.com" }],
    subject: "Monthly Team Update - March 2025",
    body: `
      <p>Hi everyone,</p>
      <p>I'm pleased to share our team's progress for March 2025. We've achieved some significant milestones this month:</p>
      <ul>
        <li>Successfully launched the new HR Management System v2.0</li>
        <li>Completed onboarding for 12 new employees across departments</li>
        <li>Reduced response time for employee inquiries by 25%</li>
      </ul>
      <p>Our next team meeting is scheduled for April 5th at 10:00 AM in the Main Conference Room. Please confirm your attendance by responding to the calendar invite.</p>
      <p>I've also attached the detailed performance report for your review.</p>
      <p>Best regards,<br/>John</p>
    `,
    date: "2025-03-15",
    time: "09:35 AM",
    status: "unread",
    folder: "inbox",
    isStarred: true,
    priority: "normal",
    labels: ["Team", "Report"],
    attachments: [
      { id: 1, filename: "March_2025_Report.pdf", size: "2.4 MB", type: "pdf" },
      { id: 2, filename: "Performance_Metrics.xlsx", size: "1.8 MB", type: "excel" }
    ],
    hasCalendarInvite: true
  },
  {
    id: 2,
    from: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      avatar: "SJ",
      department: "HR Department"
    },
    to: [{ name: "Current User", email: "user@company.com" }],
    cc: [
      { name: "Michael Brown", email: "michael.brown@company.com" },
      { name: "Jennifer Lee", email: "jennifer.lee@company.com" }
    ],
    subject: "Urgent: Benefits Enrollment Deadline Approaching",
    body: `
      <p>Dear Team,</p>
      <p>This is a friendly reminder that the open enrollment period for employee benefits will close on March 31st, 2025.</p>
      <p>If you haven't already done so, please complete your selections as soon as possible. Any employees who do not make their selections by the deadline will maintain their current benefits package.</p>
      <p>For assistance, please contact the HR department or schedule a meeting with me through the HR portal.</p>
      <p>Thank you for your prompt attention to this matter.</p>
      <p>Best regards,<br/>Sarah Johnson<br/>Human Resources Manager</p>
    `,
    date: "2025-03-14",
    time: "02:15 PM",
    status: "read",
    folder: "inbox",
    isStarred: false,
    priority: "high",
    labels: ["Benefits", "Important"]
  },
  {
    id: 3,
    from: {
      name: "Alex Wong",
      email: "alex.wong@company.com",
      avatar: "AW",
      department: "IT Department"
    },
    to: [{ name: "Current User", email: "user@company.com" }],
    subject: "System Maintenance Notice",
    body: `
      <p>Hello,</p>
      <p>Please be advised that we will be performing scheduled maintenance on our IT systems this weekend, March 17-18, 2025. During this time, the following systems will be unavailable:</p>
      <ul>
        <li>Email (6 hours, starting at 11 PM Saturday)</li>
        <li>HR Portal (8 hours, starting at 10 PM Saturday)</li>
        <li>Intranet (4 hours, starting at midnight Saturday)</li>
      </ul>
      <p>Please plan your work accordingly and save any important files before the maintenance window begins.</p>
      <p>If you have any questions or concerns, please don't hesitate to contact the IT Helpdesk.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,<br/>Alex Wong<br/>IT Operations</p>
    `,
    date: "2025-03-14",
    time: "11:42 AM",
    status: "read",
    folder: "inbox",
    isStarred: false,
    priority: "normal",
    labels: ["IT", "Maintenance"]
  },
  {
    id: 4,
    from: {
      name: "Maria Rodriguez",
      email: "maria.rodriguez@company.com",
      avatar: "MR",
      department: "Finance Department"
    },
    to: [{ name: "Current User", email: "user@company.com" }],
    subject: "Expense Report Approval Required",
    body: `
      <p>Hi there,</p>
      <p>You have 3 expense reports pending your approval in the finance system. Please review and approve these reports by end of day tomorrow to ensure timely reimbursement for the employees.</p>
      <p>You can access the reports directly through the Finance Portal or by clicking the link below:</p>
      <p><a href="#">Access Pending Approvals</a></p>
      <p>If you have any questions about any of the expenses, please contact me directly.</p>
      <p>Thank you,<br/>Maria Rodriguez<br/>Finance Department</p>
    `,
    date: "2025-03-13",
    time: "04:23 PM",
    status: "read",
    folder: "inbox",
    isStarred: true,
    priority: "high",
    labels: ["Finance", "Action Required"]
  },
  {
    id: 5,
    from: {
      name: "Training Department",
      email: "training@company.com",
      avatar: "TD",
      department: "Training Department"
    },
    to: [{ name: "Current User", email: "user@company.com" }],
    subject: "New Course Available: Leadership in the Modern Workplace",
    body: `
      <p>Dear Employee,</p>
      <p>We're excited to announce a new training course available on our Learning Management System:</p>
      <h3>Leadership in the Modern Workplace</h3>
      <p><strong>Duration:</strong> 4 hours (self-paced)<br/>
      <strong>Available from:</strong> March 15, 2025<br/>
      <strong>Completion deadline:</strong> June 30, 2025</p>
      <p>This course is recommended for all employees in management positions or those interested in future leadership roles. Upon completion, you will receive a certificate that will be added to your employee record.</p>
      <p>To enroll, simply log in to the Learning Management System and search for "Leadership in the Modern Workplace" or click the link in this email.</p>
      <p>Best regards,<br/>Training Department</p>
    `,
    date: "2025-03-12",
    time: "10:15 AM",
    status: "read",
    folder: "inbox",
    isStarred: false,
    priority: "normal",
    labels: ["Training"]
  },
  {
    id: 6,
    from: {
      name: "David Chen",
      email: "david.chen@company.com",
      avatar: "DC",
      department: "Marketing Department"
    },
    to: [{ name: "Current User", email: "user@company.com" }],
    subject: "Marketing Campaign Review Meeting",
    body: `
      <p>Hello,</p>
      <p>I'd like to schedule a meeting to review the results of our recent marketing campaign. Are you available next Tuesday at 2:00 PM?</p>
      <p>I'll share the performance metrics and customer feedback we've received so far. We should also discuss the strategy for the upcoming Q2 campaign.</p>
      <p>Please let me know if this time works for you, or suggest an alternative.</p>
      <p>Thanks,<br/>David Chen<br/>Marketing Director</p>
    `,
    date: "2025-03-11",
    time: "03:50 PM",
    status: "read",
    folder: "inbox",
    isStarred: false,
    priority: "normal",
    hasCalendarInvite: true
  },
  {
    id: 7,
    from: {
      name: "Current User",
      email: "user@company.com",
      avatar: "CU"
    },
    to: [{ name: "Jennifer Lee", email: "jennifer.lee@company.com" }],
    subject: "Project Timeline Update",
    body: `
      <p>Hi Jennifer,</p>
      <p>I've updated the project timeline based on our discussion yesterday. You can find the revised document attached to this email.</p>
      <p>The key changes include:</p>
      <ul>
        <li>Extended the research phase by one week</li>
        <li>Adjusted the delivery milestone to April 28th</li>
        <li>Added additional QA testing time before final launch</li>
      </ul>
      <p>Please review and let me know if you have any concerns.</p>
      <p>Best regards,</p>
    `,
    date: "2025-03-10",
    time: "11:25 AM",
    status: "read",
    folder: "sent",
    isStarred: false,
    priority: "normal",
    attachments: [
      { id: 3, filename: "Project_Timeline_v2.pdf", size: "1.2 MB", type: "pdf" }
    ]
  },
  {
    id: 8,
    from: {
      name: "Current User",
      email: "user@company.com",
      avatar: "CU"
    },
    to: [{ name: "HR Department", email: "hr@company.com" }],
    subject: "Vacation Request - April 10-17",
    body: `
      <p>Hello HR Team,</p>
      <p>I would like to request vacation time from April 10-17, 2025 (5 working days).</p>
      <p>I've already discussed this with my team and arranged coverage for my responsibilities during this period. All my current projects will be in a good state for handover by April 9th.</p>
      <p>Please let me know if you need any additional information.</p>
      <p>Thank you,</p>
    `,
    date: "2025-03-08",
    time: "09:15 AM",
    status: "read",
    folder: "sent",
    isStarred: true,
    priority: "normal"
  }
];

const InboxPage = () => {
  const [activeFolder, setActiveFolder] = useState<MessageFolder>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: "",
    cc: "",
    subject: "",
    body: ""
  });
  const [replyMessage, setReplyMessage] = useState("");

  // Filter messages based on active folder and search query
  const filteredEmails = emailMessages.filter(email => {
    const matchesFolder = email.folder === activeFolder;
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFolder && (searchQuery === "" || matchesSearch);
  });

  const handleSelectEmail = (email: EmailMessage) => {
    setSelectedEmail(email);
    // Mark as read if currently unread
    if (email.status === "unread") {
      // In a real app, you would update the email status in the database
      email.status = "read";
    }
  };

  const handleComposeSubmit = () => {
    // Logic to send the new message would go here
    console.log("Sending message:", newMessage);
    
    // Reset form and close compose dialog
    setNewMessage({
      to: "",
      cc: "",
      subject: "",
      body: ""
    });
    setComposeOpen(false);
  };

  const handleReplySubmit = () => {
    // Logic to send the reply would go here
    console.log("Sending reply:", replyMessage);
    
    // Reset form and close reply dialog
    setReplyMessage("");
    setReplyOpen(false);
  };

  const handleForwardSubmit = () => {
    // Logic to forward the message would go here
    console.log("Forwarding message:", selectedEmail?.id);
    
    setForwardOpen(false);
  };

  const handleStarMessage = (emailId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // In a real app, you would update the star status in the database
    const emailToUpdate = emailMessages.find(email => email.id === emailId);
    if (emailToUpdate) {
      emailToUpdate.isStarred = !emailToUpdate.isStarred;
      // Force a re-render
      setActiveFolder(activeFolder);
    }
  };

  const getFolderIcon = (folder: MessageFolder) => {
    switch (folder) {
      case "inbox": return <Mail className="h-4 w-4" />;
      case "sent": return <Send className="h-4 w-4" />;
      case "drafts": return <Pencil className="h-4 w-4" />;
      case "starred": return <Star className="h-4 w-4" />;
      case "trash": return <Trash2 className="h-4 w-4" />;
      case "archive": return <Archive className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getLabelBadge = (label: string) => {
    let bgColor = "";
    
    switch (label.toLowerCase()) {
      case "team":
        bgColor = "bg-green-100 text-green-800 border-green-200";
        break;
      case "important":
        bgColor = "bg-red-100 text-red-800 border-red-200";
        break;
      case "report":
        bgColor = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "finance":
        bgColor = "bg-purple-100 text-purple-800 border-purple-200";
        break;
      case "benefits":
        bgColor = "bg-indigo-100 text-indigo-800 border-indigo-200";
        break;
      case "maintenance":
      case "it":
        bgColor = "bg-gray-100 text-gray-800 border-gray-200";
        break;
      case "training":
        bgColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "action required":
        bgColor = "bg-orange-100 text-orange-800 border-orange-200";
        break;
      default:
        bgColor = "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
    
    return (
      <Badge key={label} variant="outline" className={`${bgColor} text-xs font-normal`}>
        {label}
      </Badge>
    );
  };

  const clearSelectedEmail = () => {
    setSelectedEmail(null);
  };

  const getPriorityIcon = (priority: MessagePriority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "low":
        return <ArrowLeftCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const startReply = () => {
    setReplyOpen(true);
  };

  const startForward = () => {
    setForwardOpen(true);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 md:col-span-3 lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Button 
                className="w-full rounded-none rounded-t-lg justify-start gap-2"
                onClick={() => setComposeOpen(true)}
              >
                <PlusCircle size={16} />
                <span>Compose</span>
              </Button>

              <div className="px-1 py-2">
                <div className="space-y-1">
                  {(["inbox", "sent", "drafts", "starred", "archive", "trash"] as MessageFolder[]).map((folder) => (
                    <Button
                      key={folder}
                      variant={activeFolder === folder ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setActiveFolder(folder);
                        setSelectedEmail(null);
                      }}
                    >
                      {getFolderIcon(folder)}
                      <span className="capitalize">{folder}</span>
                      {folder === "inbox" && (
                        <Badge className="ml-auto">
                          {emailMessages.filter(m => m.folder === "inbox" && m.status === "unread").length}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="p-3">
                <h3 className="text-sm font-medium mb-2">Labels</h3>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Important</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span>Work</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Team</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                    <span>Action Required</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email List and Detail View */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          <Card className="h-[calc(100vh-160px)] flex flex-col">
            {!selectedEmail ? (
              <>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="capitalize">{activeFolder}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>1-{filteredEmails.length} of {filteredEmails.length}</span>
                      <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-auto">
                  <div className="divide-y">
                    {filteredEmails.length > 0 ? (
                      filteredEmails.map((email) => (
                        <div 
                          key={email.id}
                          className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer ${
                            email.status === "unread" ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleSelectEmail(email)}
                        >
                          <div className="flex-shrink-0 mr-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{email.from.avatar || email.from.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`font-medium truncate ${
                                  email.status === "unread" ? "font-semibold" : ""
                                }`}>
                                  {activeFolder === "sent" ? email.to[0].name : email.from.name}
                                </p>
                                <p className={`text-sm truncate ${
                                  email.status === "unread" ? "font-semibold" : ""
                                }`}>
                                  {email.subject}
                                </p>
                              </div>
                              <div className="flex-shrink-0 flex items-center ml-4">
                                <span 
                                  className="cursor-pointer mr-2"
                                  onClick={(e) => handleStarMessage(email.id, e)}
                                >
                                  <Star 
                                    className={`h-4 w-4 ${
                                      email.isStarred ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                    }`} 
                                  />
                                </span>
                                
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {email.time}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-1 flex items-center space-x-2">
                              {getPriorityIcon(email.priority)}
                              
                              {email.hasCalendarInvite && (
                                <CalendarIcon className="h-4 w-4 text-blue-500" />
                              )}
                              
                              {email.attachments && email.attachments.length > 0 && (
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                              )}
                              
                              <p className="text-xs text-muted-foreground truncate">
                                {email.body.replace(/<[^>]*>/g, '').substring(0, 60)}...
                              </p>
                            </div>
                            
                            {email.labels && email.labels.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {email.labels.map(label => getLabelBadge(label))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg mb-1">No messages found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery 
                            ? "Try a different search term" 
                            : `Your ${activeFolder} folder is empty`}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={clearSelectedEmail}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1" onClick={startReply}>
                        <Reply className="h-4 w-4" />
                        <span>Reply</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1" onClick={startForward}>
                        <Forward className="h-4 w-4" />
                        <span>Forward</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Archive className="h-4 w-4" />
                            <span>Archive</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Bookmark className="h-4 w-4" />
                            <span>Bookmark</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <span 
                              className="cursor-pointer mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStarMessage(selectedEmail.id, e as React.MouseEvent);
                              }}
                            >
                              {selectedEmail.isStarred ? "Remove Star" : "Add Star"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2">
                        {selectedEmail.subject}
                        {selectedEmail.priority === "high" && (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 ml-2">
                            High Priority
                          </Badge>
                        )}
                      </h2>
                      
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{selectedEmail.from.avatar || selectedEmail.from.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{selectedEmail.from.name}</p>
                              <p className="text-sm text-muted-foreground">{selectedEmail.from.email}</p>
                              {selectedEmail.from.department && (
                                <p className="text-xs text-muted-foreground">{selectedEmail.from.department}</p>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedEmail.date} at {selectedEmail.time}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>
                              To: {selectedEmail.to.map(recipient => recipient.name).join(", ")}
                            </p>
                            {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                              <p>
                                Cc: {selectedEmail.cc.map(recipient => recipient.name).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {selectedEmail.hasCalendarInvite && (
                      <div className="p-4 border rounded-md bg-blue-50">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="h-10 w-10 text-blue-600" />
                          <div>
                            <h3 className="font-medium">Calendar Invitation</h3>
                            <p className="text-sm">Team Meeting: April 5, 2025 at 10:00 AM</p>
                            <p className="text-sm text-muted-foreground">Main Conference Room</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>Accept</span>
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Tentative</span>
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <XCircle className="h-4 w-4" />
                            <span>Decline</span>
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />
                    
                    {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Attachments ({selectedEmail.attachments.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedEmail.attachments.map(attachment => (
                            <div 
                              key={attachment.id} 
                              className="flex items-center p-3 border rounded-md"
                            >
                              <div className="h-9 w-9 rounded bg-muted flex items-center justify-center mr-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{attachment.filename}</p>
                                <p className="text-xs text-muted-foreground">{attachment.size}</p>
                              </div>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Compose Email Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input 
                id="to" 
                placeholder="recipient@company.com" 
                value={newMessage.to}
                onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cc">Cc</Label>
              <Input 
                id="cc" 
                placeholder="cc@company.com" 
                value={newMessage.cc}
                onChange={(e) => setNewMessage({...newMessage, cc: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                placeholder="Message subject" 
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                rows={8}
                placeholder="Compose your message..." 
                value={newMessage.body}
                onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Paperclip className="h-4 w-4" />
                <span>Attach</span>
              </Button>
              <div className="flex-1"></div>
              <Select defaultValue="normal">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleComposeSubmit} className="gap-1">
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply: {selectedEmail?.subject}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-3 border rounded-md bg-muted">
              <p className="text-sm font-medium">To: {selectedEmail?.from.name} &lt;{selectedEmail?.from.email}&gt;</p>
              <p className="text-sm mt-1 text-muted-foreground">
                On {selectedEmail?.date} at {selectedEmail?.time}, {selectedEmail?.from.name} wrote:
              </p>
              <div className="mt-2 text-sm text-muted-foreground pl-2 border-l-2 border-muted-foreground">
                {selectedEmail?.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </div>
            </div>
            <div className="grid gap-2">
              <Textarea 
                rows={8}
                placeholder="Write your reply..." 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Paperclip className="h-4 w-4" />
                <span>Attach</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReplySubmit} className="gap-1">
              <Send className="h-4 w-4" />
              <span>Send Reply</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forward Dialog */}
      <Dialog open={forwardOpen} onOpenChange={setForwardOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Forward: {selectedEmail?.subject}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" placeholder="recipient@company.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cc">Cc</Label>
              <Input id="cc" placeholder="cc@company.com" />
            </div>
            <div className="p-3 border rounded-md bg-muted">
              <p className="text-sm font-medium">Original Message:</p>
              <p className="text-sm mt-1 text-muted-foreground">
                From: {selectedEmail?.from.name} &lt;{selectedEmail?.from.email}&gt;<br />
                Date: {selectedEmail?.date} at {selectedEmail?.time}<br />
                Subject: {selectedEmail?.subject}
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedEmail?.body.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                rows={5}
                placeholder="Add a message..." 
              />
            </div>
            {selectedEmail?.attachments && selectedEmail.attachments.length > 0 && (
              <div>
                <Label className="mb-2 block">Attachments</Label>
                <div className="space-y-2">
                  {selectedEmail.attachments.map(attachment => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center p-2 border rounded-md"
                    >
                      <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{attachment.filename}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{attachment.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForwardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleForwardSubmit} className="gap-1">
              <Forward className="h-4 w-4" />
              <span>Forward</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InboxPage;