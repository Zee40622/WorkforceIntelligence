import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, insertTaskSchema } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const TasksComponent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Assuming we have a logged-in user with ID 1 (admin)
  const userId = 1;
  
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: [`/api/users/${userId}/tasks`],
  });

  // Create task form schema
  const formSchema = insertTaskSchema.extend({
    dueDate: z.string().min(1, "Due date is required")
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "normal",
      completed: false,
    },
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Convert dueDate string to proper date format for API
      const formattedData = {
        ...data,
        dueDate: new Date(data.dueDate)
      };
      
      return await apiRequest("POST", "/api/tasks", formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/tasks`] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create task",
        description: error.message,
      });
    },
  });

  // Toggle task completion mutation
  const toggleTaskCompletion = useMutation({
    mutationFn: async (taskId: number) => {
      return await apiRequest("PUT", `/api/tasks/${taskId}/toggle`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/tasks`] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: error.message,
      });
    },
  });

  // Function to handle task creation
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTask.mutate(data);
  };

  // Function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="outline" className="bg-error bg-opacity-10 text-error border-error">
            Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge variant="outline" className="bg-error bg-opacity-10 text-error border-error">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-warning bg-opacity-10 text-warning border-warning">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-neutral-medium bg-opacity-10 text-neutral-dark border-neutral-medium">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-medium bg-opacity-10 text-neutral-dark border-neutral-medium">
            Normal
          </Badge>
        );
    }
  };

  // Function to format due date
  const formatDueDate = (dueDate: Date | null) => {
    if (!dueDate) return "";
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const date = new Date(dueDate);
    
    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return "Due today";
    }
    
    // Check if tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Due tomorrow";
    }
    
    // Calculate days difference
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `Due in ${diffDays} days`;
    } else if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else {
      return "Due today";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-medium">HR Tasks</CardTitle>
        <button className="text-sm text-primary hover:text-primary-dark">
          View all
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-4 text-center">Loading tasks...</div>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="flex items-start">
                <Checkbox 
                  id={`task-${task.id}`}
                  className="h-4 w-4 mt-1 text-primary border-neutral-medium rounded"
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion.mutate(task.id)}
                />
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${task.completed ? "line-through text-neutral-medium" : ""}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-neutral-medium mt-1">
                    {formatDueDate(task.dueDate)}
                  </p>
                </div>
                {getPriorityBadge(task.priority)}
              </div>
            ))
          ) : (
            <div className="py-4 text-center">No tasks found</div>
          )}
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-primary-light rounded-md text-sm font-medium text-primary hover:bg-primary-light hover:bg-opacity-10 transition"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createTask.isPending}
                  >
                    {createTask.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TasksComponent;
