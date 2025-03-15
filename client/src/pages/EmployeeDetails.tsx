import React from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Employee } from "@shared/schema";
import EmployeeDetail from "@/components/employees/EmployeeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EmployeeDetails: React.FC = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/employees/:id");
  const employeeId = params?.id ? parseInt(params.id) : undefined;

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const employee = employees?.find(emp => emp.id === employeeId);

  if (!employeeId || !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Employee Not Found</h2>
        <p className="text-neutral-medium mb-6">The employee you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/employees")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/employees")}
              className="mb-2 -ml-2 text-neutral-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Employees
            </Button>
            <h2 className="text-2xl font-semibold text-neutral-dark">Employee Details</h2>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          View and manage employee information, documents, and work permits
        </p>
      </div>

      {/* Employee Details Component */}
      <EmployeeDetail employee={employee} />
    </div>
  );
};

export default EmployeeDetails;