import React, { useState } from "react";
import AttendanceCalendar from "@/components/attendance/AttendanceCalendar";
import LeaveRequest from "@/components/attendance/LeaveRequest";
import BiometricAttendance from "@/components/attendance/BiometricAttendance";
import VoiceAttendance from "@/components/attendance/VoiceAttendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Attendance, Leave } from "@shared/schema";
import { Clock, Calendar, CheckCircle, User, ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs as UiTabs, TabsContent as UiTabsContent, TabsList as UiTabsList, TabsTrigger as UiTabsTrigger } from "@/components/ui/tabs";

const AttendancePage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("standard");
  
  // Assuming we're viewing the currently logged-in employee with ID 1
  const employeeId = 1;
  
  // Fetch attendance data
  const { data: attendanceRecords } = useQuery<Attendance[]>({
    queryKey: [`/api/employees/${employeeId}/attendance`],
  });
  
  // Fetch leave data
  const { data: leaveRecords } = useQuery<Leave[]>({
    queryKey: [`/api/employees/${employeeId}/leaves`],
  });

  // Check-in mutation
  const checkIn = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/attendance", {
        employeeId,
        date: new Date(),
        checkIn: new Date(),
        status: "present"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/attendance`] });
      toast({
        title: "Checked in",
        description: "Your attendance has been recorded"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to check in",
        description: error.message
      });
    }
  });

  // Check-out mutation
  const checkOut = useMutation({
    mutationFn: async (attendanceId: number) => {
      return apiRequest("PUT", `/api/attendance/${attendanceId}`, {
        checkOut: new Date()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/attendance`] });
      toast({
        title: "Checked out",
        description: "Your check out has been recorded"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to check out",
        description: error.message
      });
    }
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Check if employee has already checked in today
  const todayAttendance = attendanceRecords?.find(record => 
    new Date(record.date).toISOString().split('T')[0] === today
  );

  // Calculate attendance statistics
  const totalWorkdays = 22; // Assuming 22 workdays in a month
  const presentDays = attendanceRecords?.filter(a => a.status === "present").length || 0;
  const attendanceRate = totalWorkdays > 0 ? Math.round((presentDays / totalWorkdays) * 100) : 0;

  // Calculate leave statistics
  const approvedLeaves = leaveRecords?.filter(l => l.status === "approved").length || 0;
  const pendingLeaves = leaveRecords?.filter(l => l.status === "pending").length || 0;

  // Handle check-in button click
  const handleCheckIn = () => {
    checkIn.mutate();
  };

  // Handle check-out button click
  const handleCheckOut = () => {
    if (todayAttendance?.id) {
      checkOut.mutate(todayAttendance.id);
    }
  };

  // Format time
  const formatTime = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-dark">Attendance Management</h2>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          Manage employee attendance, time tracking, and leave requests
        </p>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Present</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentDays}/{totalWorkdays}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaves}</div>
            <p className="text-xs text-muted-foreground">Total this year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Tabs */}
      <UiTabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <UiTabsList className="grid w-full grid-cols-3 mb-4">
          <UiTabsTrigger value="standard">Standard Check-in</UiTabsTrigger>
          <UiTabsTrigger value="biometric">Biometric Attendance</UiTabsTrigger>
          <UiTabsTrigger value="voice">AI Voice Attendance</UiTabsTrigger>
        </UiTabsList>
        
        <UiTabsContent value="standard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-medium">Status</p>
                    <div className="mt-1">
                      {todayAttendance ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Present
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-neutral-light">
                          Not Recorded
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-neutral-medium">Date</p>
                    <p className="text-sm font-medium mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-medium">Check-in Time</p>
                    <p className="text-sm font-medium mt-1">
                      {formatTime(todayAttendance?.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-medium">Check-out Time</p>
                    <p className="text-sm font-medium mt-1">
                      {formatTime(todayAttendance?.checkOut)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <Button 
                    className="flex-1" 
                    variant={todayAttendance ? "outline" : "default"}
                    disabled={!!todayAttendance?.checkIn}
                    onClick={handleCheckIn}
                  >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant={todayAttendance?.checkOut ? "outline" : "default"}
                    disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
                    onClick={handleCheckOut}
                  >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    Check Out
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <LeaveRequest employeeId={employeeId} />
            </div>
          </div>
        </UiTabsContent>
        
        <UiTabsContent value="biometric">
          <BiometricAttendance />
        </UiTabsContent>

        <UiTabsContent value="voice">
          <VoiceAttendance employeeId={employeeId} />
        </UiTabsContent>
      </UiTabs>

      {/* Calendar */}
      <AttendanceCalendar />
    </div>
  );
};

export default AttendancePage;
