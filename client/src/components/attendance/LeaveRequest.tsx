import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertLeave, Leave, Employee } from "@shared/schema";

interface LeaveRequestProps {
  employeeId?: number;
}

const LeaveRequest: React.FC<LeaveRequestProps> = ({ employeeId = 1 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch employee data
  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });
  
  // Fetch existing leave requests
  const { data: leaveRequests } = useQuery<Leave[]>({
    queryKey: [`/api/employees/${employeeId}/leaves`],
  });

  // Form schema
  const formSchema = z.object({
    employeeId: z.number(),
    startDate: z.date(),
    endDate: z.date(),
    type: z.enum(['annual', 'sick', 'unpaid', 'maternity', 'paternity', 'bereavement', 'other']),
    reason: z.string().min(5, "Please provide a reason for your leave request").max(500),
  }).refine(data => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId,
      startDate: new Date(),
      endDate: new Date(),
      type: 'annual',
      reason: '',
    },
  });

  // Submit leave request
  const submitLeaveRequest = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/leaves", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/leaves`] });
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted successfully",
      });
      form.reset();
      setIsExpanded(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit leave request",
        description: error.message,
      });
    },
  });

  // Submit handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submitLeaveRequest.mutate(data);
  };

  // Format leave status
  const formatLeaveStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  // Format leave type
  const formatLeaveType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Calculate leave duration
  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Leave Requests</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Cancel' : (
              <>
                <PlusIcon className="h-4 w-4 mr-1" />
                New Request
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isExpanded ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              date < form.getValues().startDate
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                        <SelectItem value="maternity">Maternity Leave</SelectItem>
                        <SelectItem value="paternity">Paternity Leave</SelectItem>
                        <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a reason for your leave request"
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitLeaveRequest.isPending}
                >
                  {submitLeaveRequest.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            {leaveRequests && leaveRequests.length > 0 ? (
              leaveRequests.map((leave) => (
                <div key={leave.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{formatLeaveType(leave.type)} Leave</h4>
                      <p className="text-sm text-neutral-medium">
                        {format(new Date(leave.startDate), "MMM dd, yyyy")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                        <span className="ml-2">
                          ({calculateDuration(leave.startDate, leave.endDate)})
                        </span>
                      </p>
                    </div>
                    <div>
                      <span 
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          leave.status === 'pending' && "bg-warning bg-opacity-10 text-warning",
                          leave.status === 'approved' && "bg-success bg-opacity-10 text-success",
                          leave.status === 'rejected' && "bg-error bg-opacity-10 text-error"
                        )}
                      >
                        {formatLeaveStatus(leave.status)}
                      </span>
                    </div>
                  </div>
                  {leave.reason && (
                    <p className="text-sm mt-2">{leave.reason}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-medium py-4">No leave requests found</p>
            )}
          </div>
        )}
      </CardContent>
      
      {!isExpanded && leaveRequests && leaveRequests.length > 0 && (
        <CardFooter className="pt-0">
          <Button variant="outline" className="w-full" onClick={() => setIsExpanded(true)}>
            <PlusIcon className="h-4 w-4 mr-1" />
            New Request
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LeaveRequest;
