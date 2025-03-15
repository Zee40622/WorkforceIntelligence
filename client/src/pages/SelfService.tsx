import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle,
  Bell,
  Mail,
  MessageSquare,
  Send
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

const payslips = [
  { id: 1, period: 'March 2025', amount: '$4,500.00', date: '2025-03-31', status: 'Paid' },
  { id: 2, period: 'February 2025', amount: '$4,500.00', date: '2025-02-28', status: 'Paid' },
  { id: 3, period: 'January 2025', amount: '$4,300.00', date: '2025-01-31', status: 'Paid' },
  { id: 4, period: 'December 2024', amount: '$4,300.00', date: '2024-12-31', status: 'Paid' },
  { id: 5, period: 'November 2024', amount: '$4,300.00', date: '2024-11-30', status: 'Paid' },
];

const leaveRequests = [
  { id: 1, type: 'Annual Leave', startDate: '2025-04-10', endDate: '2025-04-15', status: 'pending', days: 5 },
  { id: 2, type: 'Sick Leave', startDate: '2025-02-03', endDate: '2025-02-04', status: 'approved', days: 2 },
  { id: 3, type: 'Unpaid Leave', startDate: '2024-12-27', endDate: '2024-12-29', status: 'approved', days: 3 },
  { id: 4, type: 'Annual Leave', startDate: '2024-11-20', endDate: '2024-11-24', status: 'rejected', days: 5 },
];

const taxDocuments = [
  { id: 1, name: 'W-2 Form 2024', date: '2025-01-31' },
  { id: 2, name: 'W-2 Form 2023', date: '2024-01-31' },
  { id: 3, name: 'Tax Declaration Form', date: '2024-12-15' },
];

const attendanceRecords = [
  { id: 1, date: '2025-03-14', checkIn: '08:55 AM', checkOut: '05:15 PM', status: 'Present' },
  { id: 2, date: '2025-03-13', checkIn: '09:02 AM', checkOut: '05:30 PM', status: 'Present' },
  { id: 3, date: '2025-03-12', checkIn: '08:50 AM', checkOut: '06:05 PM', status: 'Present' },
  { id: 4, date: '2025-03-11', checkIn: null, checkOut: null, status: 'On Leave' },
  { id: 5, date: '2025-03-10', checkIn: '08:45 AM', checkOut: '05:00 PM', status: 'Present' },
];

const announcements = [
  { 
    id: 1, 
    title: 'New Health Insurance Plan', 
    date: '2025-03-10', 
    content: 'We are pleased to announce updates to our health insurance coverage effective April 1st. The new plan includes improved dental and vision benefits.' 
  },
  { 
    id: 2, 
    title: 'Office Closure - Spring Holiday', 
    date: '2025-03-05', 
    content: 'The office will be closed on April 18th and 19th for the Spring Holiday. Please plan accordingly.' 
  },
  { 
    id: 3, 
    title: 'Employee Appreciation Week', 
    date: '2025-02-28', 
    content: 'Join us for Employee Appreciation Week starting March 20th. We have planned several activities and surprises throughout the week.' 
  },
];

const messages = [
  { 
    id: 1, 
    sender: 'John Smith', 
    avatar: 'J', 
    subject: 'Performance Review Schedule', 
    message: 'Hi, I wanted to confirm our performance review meeting next week on Tuesday at 2 PM. Please let me know if that works for you.',
    date: '2025-03-14',
    read: false 
  },
  { 
    id: 2, 
    sender: 'HR Department', 
    avatar: 'HR', 
    subject: 'Benefits Enrollment Reminder', 
    message: 'This is a reminder that open enrollment for benefits ends next Friday. Please make your selections by the deadline.',
    date: '2025-03-12',
    read: true 
  },
  { 
    id: 3, 
    sender: 'Anna Johnson', 
    avatar: 'A', 
    subject: 'Team Building Event', 
    message: 'We are planning a team building event next month. Please fill out the survey to help us choose activities everyone will enjoy.',
    date: '2025-03-10',
    read: true 
  },
];

const SelfServicePage = () => {
  const [activeTab, setActiveTab] = useState('payslips');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [leaveType, setLeaveType] = useState('annual');
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState<Date | undefined>(new Date());
  const [leaveEndDate, setLeaveEndDate] = useState<Date | undefined>(new Date());
  const [leaveReason, setLeaveReason] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newMessageData, setNewMessageData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  // Calculate remaining leave balances
  const leaveBalances = {
    annual: 15,
    sick: 10,
    unpaid: 'Unlimited',
    used: {
      annual: 5,
      sick: 2,
    }
  };

  const calculateRemainingDays = (type: 'annual' | 'sick') => {
    return leaveBalances[type] - (leaveBalances.used[type] || 0);
  };

  const handleLeaveSubmit = () => {
    // Logic to submit leave request
    console.log({
      type: leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      reason: leaveReason
    });
    setIsLeaveDialogOpen(false);
    setLeaveReason('');
  };

  const handleNewMessageSubmit = () => {
    // Logic to send new message
    console.log(newMessageData);
    setIsMessageDialogOpen(false);
    setNewMessageData({
      recipient: '',
      subject: '',
      message: ''
    });
  };

  const handleReply = () => {
    // Logic to send reply
    console.log({
      messageId: selectedMessageId,
      reply: replyText
    });
    setReplyText('');
    setSelectedMessageId(null);
  };

  const selectedMessage = messages.find(msg => msg.id === selectedMessageId);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Employee Self-Service Portal</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Bell size={16} />
            <span>Notifications</span>
          </Button>
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Mail size={16} />
                <span>New Message</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Send a message to your colleagues or departments.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select onValueChange={(value) => setNewMessageData({...newMessageData, recipient: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">HR Department</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                      <SelectItem value="john">John Smith (Manager)</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson (HR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={newMessageData.subject}
                    onChange={(e) => setNewMessageData({...newMessageData, subject: e.target.value})}
                    placeholder="Message subject" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    rows={5}
                    value={newMessageData.message}
                    onChange={(e) => setNewMessageData({...newMessageData, message: e.target.value})}
                    placeholder="Type your message here" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewMessageSubmit} className="gap-1">
                  <Send size={16} />
                  <span>Send Message</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payslips">Pay Slips</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="tax">Tax Documents</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="payslips" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pay Slips</CardTitle>
              <CardDescription>Access and download your pay slips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Period</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {payslips.map((payslip) => (
                      <tr key={payslip.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{payslip.period}</td>
                        <td className="p-4 align-middle">{payslip.amount}</td>
                        <td className="p-4 align-middle">{payslip.date}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {payslip.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                              <FileText size={14} />
                              <span>View</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                              <Download size={14} />
                              <span>Download</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>View your attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Check In</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Check Out</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {attendanceRecords.map((record) => (
                      <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{record.date}</td>
                        <td className="p-4 align-middle">{record.checkIn || '—'}</td>
                        <td className="p-4 align-middle">{record.checkOut || '—'}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className={
                            record.status === 'Present' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }>
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leave Balances</CardTitle>
                <CardDescription>Your current leave entitlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border border-green-100">
                    <div>
                      <p className="font-medium">Annual Leave</p>
                      <p className="text-sm text-muted-foreground">
                        Used: {leaveBalances.used.annual} days | Remaining: {calculateRemainingDays('annual')} days
                      </p>
                    </div>
                    <div className="text-xl font-bold">{leaveBalances.annual}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div>
                      <p className="font-medium">Sick Leave</p>
                      <p className="text-sm text-muted-foreground">
                        Used: {leaveBalances.used.sick} days | Remaining: {calculateRemainingDays('sick')} days
                      </p>
                    </div>
                    <div className="text-xl font-bold">{leaveBalances.sick}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                    <div>
                      <p className="font-medium">Unpaid Leave</p>
                      <p className="text-sm text-muted-foreground">
                        Available as needed with approval
                      </p>
                    </div>
                    <div className="text-xl font-bold">{leaveBalances.unpaid}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Request Leave</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Request Leave</DialogTitle>
                      <DialogDescription>
                        Complete the form below to submit a leave request
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="leaveType">Leave Type</Label>
                        <Select defaultValue={leaveType} onValueChange={setLeaveType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Start Date</Label>
                          <div className="p-0.5 border rounded-md">
                            <Calendar
                              mode="single"
                              selected={leaveStartDate}
                              onSelect={setLeaveStartDate}
                              className="rounded-md border"
                              initialFocus
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>End Date</Label>
                          <div className="p-0.5 border rounded-md">
                            <Calendar
                              mode="single"
                              selected={leaveEndDate}
                              onSelect={setLeaveEndDate}
                              className="rounded-md border"
                              initialFocus
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea 
                          id="reason" 
                          value={leaveReason}
                          onChange={(e) => setLeaveReason(e.target.value)}
                          placeholder="Briefly describe the reason for your leave request" 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleLeaveSubmit}>Submit Request</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Your recent leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaveRequests.map(request => (
                    <div key={request.id} className="flex justify-between p-3 border rounded-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.type}</span>
                          <Badge variant="outline" className={
                            request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : request.status === 'approved'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                          }>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.startDate} to {request.endDate} ({request.days} days)
                        </p>
                      </div>
                      <div className="flex items-center">
                        {request.status === 'pending' ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : request.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Documents</CardTitle>
              <CardDescription>Access and download your tax-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxDocuments.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">Generated: {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <FileText size={14} />
                        <span>View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Download size={14} />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Company-wide announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map(announcement => (
                    <div key={announcement.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{announcement.content}</p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        Read more
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Personal communications</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {selectedMessageId ? (
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{selectedMessage?.subject}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{selectedMessage?.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{selectedMessage?.sender}</span>
                          <span className="text-xs text-muted-foreground">• {selectedMessage?.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedMessageId(null)}>
                        Back
                      </Button>
                    </div>
                    <p className="text-sm mb-6 p-3 bg-muted rounded-md">
                      {selectedMessage?.message}
                    </p>
                    <div className="space-y-2">
                      <Textarea 
                        placeholder="Type your reply..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleReply} size="sm" className="gap-1">
                          <Send size={14} />
                          <span>Reply</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex items-start p-4 cursor-pointer hover:bg-muted/50 ${!message.read ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedMessageId(message.id)}
                      >
                        <Avatar className="h-9 w-9 mr-3 mt-0.5">
                          <AvatarFallback>{message.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className={`font-medium truncate ${!message.read ? 'font-semibold' : ''}`}>
                              {message.subject}
                            </p>
                            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                              {message.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.sender}</p>
                          <p className="text-sm truncate">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SelfServicePage;