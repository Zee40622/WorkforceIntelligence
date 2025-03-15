import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Employee } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  EditIcon, 
  Trash2Icon, 
  FileTextIcon,
  PlusIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetail from "./EmployeeDetail";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EmployeeList: React.FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  // Delete employee mutation
  const deleteEmployee = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/employees/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      toast({
        title: "Employee deleted",
        description: "The employee has been deleted successfully",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete employee",
        description: error.message,
      });
    },
  });

  // Filter employees based on search term
  const filteredEmployees = employees?.filter(employee => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      employee.employeeId.toLowerCase().includes(searchTermLower) ||
      employee.position.toLowerCase().includes(searchTermLower) ||
      employee.department.toLowerCase().includes(searchTermLower)
    );
  });

  // Format department for display
  const formatDepartment = (department: string) => {
    return department.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get employment type badge
  const getEmploymentTypeBadge = (type: string) => {
    switch (type) {
      case "full_time":
        return (
          <Badge variant="outline" className="bg-success bg-opacity-10 text-success border-success">
            Full Time
          </Badge>
        );
      case "part_time":
        return (
          <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary border-primary">
            Part Time
          </Badge>
        );
      case "contract":
        return (
          <Badge variant="outline" className="bg-warning bg-opacity-10 text-warning border-warning">
            Contract
          </Badge>
        );
      case "intern":
        return (
          <Badge variant="outline" className="bg-info bg-opacity-10 text-info border-info">
            Intern
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-medium bg-opacity-10 text-neutral-dark">
            {type}
          </Badge>
        );
    }
  };

  const handleView = (employee: Employee) => {
    setLocation(`/employees/${employee.id}`);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <EmployeeForm onSuccess={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading employees...
                </TableCell>
              </TableRow>
            ) : filteredEmployees && filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{formatDepartment(employee.department)}</TableCell>
                  <TableCell>
                    {getEmploymentTypeBadge(employee.employmentType)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(employee)}
                      >
                        <FileTextIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(employee)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(employee)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Employee Dialog */}
      {selectedEmployee && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <EmployeeForm 
              employee={selectedEmployee}
              onSuccess={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {selectedEmployee && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the employee record for{" "}
                <strong>{selectedEmployee.employeeId}</strong>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteEmployee.mutate(selectedEmployee.id)}
                className="bg-error hover:bg-error/90"
              >
                {deleteEmployee.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default EmployeeList;
