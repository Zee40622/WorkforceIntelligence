import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Payroll } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DownloadIcon, FilterIcon, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PayrollTable: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: payrolls, isLoading } = useQuery<Payroll[]>({
    queryKey: ["/api/payroll"],
  });

  // Filter payrolls based on status
  const filteredPayrolls = payrolls?.filter(payroll => {
    if (!statusFilter) return true;
    return payroll.status === statusFilter;
  });

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning bg-opacity-10 text-warning border-warning">
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary border-primary">
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-success bg-opacity-10 text-success border-success">
            Completed
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-error bg-opacity-10 text-error border-error">
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-medium bg-opacity-10 text-neutral-dark">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-neutral-medium" />
            <span className="text-sm text-neutral-medium">Filter by:</span>
          </div>
          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Payroll
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Loading payroll data...
                  </TableCell>
                </TableRow>
              ) : filteredPayrolls && filteredPayrolls.length > 0 ? (
                filteredPayrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>{payroll.employeeId}</TableCell>
                    <TableCell>{payroll.period}</TableCell>
                    <TableCell>{formatCurrency(payroll.baseSalary)}</TableCell>
                    <TableCell>{formatCurrency(payroll.bonus)}</TableCell>
                    <TableCell>{formatCurrency(payroll.deductions)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payroll.netSalary)}</TableCell>
                    <TableCell>{formatDate(payroll.paymentDate)}</TableCell>
                    <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No payroll records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default PayrollTable;
