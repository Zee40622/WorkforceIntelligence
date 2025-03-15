import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Attendance, Leave } from "@shared/schema";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon, 
  InfoIcon 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AttendanceCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  
  // Fetch attendance data
  const { data: attendanceData } = useQuery<Attendance[]>({
    queryKey: ["/api/attendance"],
  });
  
  // Fetch leaves data
  const { data: leavesData } = useQuery<Leave[]>({
    queryKey: ["/api/leaves"],
  });

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Function to check if a date has attendance record
  const hasAttendance = (day: Date): boolean => {
    if (!attendanceData) return false;
    const formattedDate = formatDate(day);
    
    return attendanceData.some(a => 
      formatDate(new Date(a.date)) === formattedDate && a.status === 'present'
    );
  };

  // Function to check if a date is on leave
  const isOnLeave = (day: Date): boolean => {
    if (!leavesData) return false;
    const formattedDate = formatDate(day);
    
    return leavesData.some(leave => {
      const startDate = formatDate(new Date(leave.startDate));
      const endDate = formatDate(new Date(leave.endDate));
      const dayDate = formatDate(day);
      
      return dayDate >= startDate && dayDate <= endDate && leave.status === 'approved';
    });
  };

  // Function to check if a date is a pending leave
  const isPendingLeave = (day: Date): boolean => {
    if (!leavesData) return false;
    const formattedDate = formatDate(day);
    
    return leavesData.some(leave => {
      const startDate = formatDate(new Date(leave.startDate));
      const endDate = formatDate(new Date(leave.endDate));
      const dayDate = formatDate(day);
      
      return dayDate >= startDate && dayDate <= endDate && leave.status === 'pending';
    });
  };

  // Function to get day status
  const getDayStatus = (day: Date) => {
    if (isOnLeave(day)) return "leave";
    if (isPendingLeave(day)) return "pending";
    if (hasAttendance(day)) return "present";
    
    // Check if date is in the past but not marked
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (day < today && day.getDay() !== 0 && day.getDay() !== 6) {
      return "absent";
    }
    
    return null;
  };

  // Custom day renderer
  const renderDay = (day: Date) => {
    const status = getDayStatus(day);
    
    let className = "";
    let tooltipText = "";
    
    switch (status) {
      case "present":
        className = "bg-success bg-opacity-20 text-success font-semibold";
        tooltipText = "Present";
        break;
      case "absent":
        className = "bg-error bg-opacity-20 text-error font-semibold";
        tooltipText = "Absent";
        break;
      case "leave":
        className = "bg-primary bg-opacity-20 text-primary font-semibold";
        tooltipText = "On Approved Leave";
        break;
      case "pending":
        className = "bg-warning bg-opacity-20 text-warning font-semibold";
        tooltipText = "Pending Leave";
        break;
      default:
        break;
    }
    
    if (!className) return null;
    
    return (
      <div className={`h-full w-full rounded-md flex items-center justify-center ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{day.getDate()}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  // Get the current month and year
  const currentMonth = month.toLocaleString('default', { month: 'long' });
  const currentYear = month.getFullYear();

  // Handle month navigation
  const previousMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() - 1);
    setMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() + 1);
    setMonth(newMonth);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Attendance Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <button 
            onClick={previousMonth}
            className="p-1 rounded-full hover:bg-neutral-light"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="font-medium">
            {currentMonth} {currentYear}
          </span>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-neutral-light"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border"
            components={{
              Day: (props) => {
                if (!props.date) return null;
                return (
                  <div {...props}>
                    {renderDay(props.date) || props.date.getDate()}
                  </div>
                );
              },
            }}
          />
          
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center">
              <Badge className="bg-success bg-opacity-20 text-success">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Present
              </Badge>
            </div>
            <div className="flex items-center">
              <Badge className="bg-error bg-opacity-20 text-error">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Absent
              </Badge>
            </div>
            <div className="flex items-center">
              <Badge className="bg-primary bg-opacity-20 text-primary">
                <CalendarIcon className="h-3 w-3 mr-1" />
                On Leave
              </Badge>
            </div>
            <div className="flex items-center">
              <Badge className="bg-warning bg-opacity-20 text-warning">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-neutral-medium mt-1">
            <InfoIcon className="h-3 w-3 mr-1" />
            <span>Click on a day to view detailed attendance information</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
