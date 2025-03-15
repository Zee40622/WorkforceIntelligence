import React from "react";
import PayrollTable from "@/components/payroll/PayrollTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Payroll } from "@shared/schema";
import { DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const PayrollPage: React.FC = () => {
  // Fetch payroll data
  const { data: payrolls } = useQuery<Payroll[]>({
    queryKey: ["/api/payroll"],
  });

  // Calculate metrics
  const totalPayroll = payrolls?.reduce((sum, payroll) => sum + Number(payroll.netSalary), 0) || 0;
  const averageSalary = payrolls && payrolls.length > 0 
    ? totalPayroll / payrolls.length 
    : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-dark">Payroll Management</h2>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          Manage employee compensation, including salaries, bonuses, and deductions
        </p>
      </div>

      {/* Payroll Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayroll)}</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageSalary)}</div>
            <p className="text-xs text-muted-foreground">Per employee</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payrolls?.reduce((sum, payroll) => sum + Number(payroll.bonus || 0), 0) || 0)}</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payday</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15th</div>
            <p className="text-xs text-muted-foreground">10 days from now</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <PayrollTable />
    </div>
  );
};

export default PayrollPage;
