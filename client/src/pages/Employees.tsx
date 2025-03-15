import React from "react";
import EmployeeList from "@/components/employees/EmployeeList";

const Employees: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-dark">Employee Management</h2>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          Manage your employee database, including personal and professional details
        </p>
      </div>

      {/* Employee List */}
      <EmployeeList />
    </div>
  );
};

export default Employees;
