import React from "react";
import { Employee } from "@shared/schema";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployeeDetailProps {
  employee: Employee;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee }) => {
  // Format department for display
  const formatDepartment = (department: string) => {
    return department.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format employment type for display
  const formatEmploymentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Format salary for display
  const formatSalary = (salary: number | null) => {
    if (salary === null || salary === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-lg font-semibold">
            {employee.employeeId}
          </h3>
          <p className="text-neutral-medium text-sm">
            {employee.position}
          </p>
        </div>
        <Badge className="bg-primary text-white">
          {formatEmploymentType(employee.employmentType)}
        </Badge>
      </div>
      
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-neutral-medium">Department</p>
              <p className="text-sm font-medium">{formatDepartment(employee.department)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-medium">Hire Date</p>
              <p className="text-sm font-medium">{formatDate(employee.hireDate)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-neutral-medium">Date of Birth</p>
              <p className="text-sm font-medium">{formatDate(employee.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-medium">User ID</p>
              <p className="text-sm font-medium">{employee.userId}</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-neutral-medium">Address</p>
            <p className="text-sm font-medium">{employee.address || "N/A"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-neutral-medium">Phone</p>
              <p className="text-sm font-medium">{employee.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-medium">Salary</p>
              <p className="text-sm font-medium">{formatSalary(employee.salary)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-neutral-medium">Emergency Contact</p>
            <p className="text-sm font-medium">{employee.emergencyContact || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
