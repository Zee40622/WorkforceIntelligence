import React from "react";
import { Users, CreditCard, Clock, LineChart } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivities from "@/components/dashboard/RecentActivities";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import TasksComponent from "@/components/dashboard/Tasks";
import Announcements from "@/components/dashboard/Announcements";
import { useQuery } from "@tanstack/react-query";
import { Activity, Employee } from "@shared/schema";

const Dashboard: React.FC = () => {
  // Fetch data needed for stats
  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });
  
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
  });

  // Calculate stats
  const totalEmployees = employees?.length || 0;
  const pendingActivities = activities?.filter(a => a.status === "pending").length || 0;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-dark">HR Dashboard</h2>
          <div>
            <span className="text-sm text-neutral-medium mr-2">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          Overview of your company's HR metrics and activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={<Users className="text-primary" />}
          iconBgColor="bg-primary-light"
          change={3.2}
        />
        <StatCard
          title="Open Positions"
          value={12}
          icon={<Users className="text-secondary" />}
          iconBgColor="bg-secondary-light"
          change={-2.5}
        />
        <StatCard
          title="Attendance Rate"
          value="96.8%"
          icon={<Clock className="text-success" />}
          iconBgColor="bg-success"
          change={1.1}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingActivities}
          icon={<LineChart className="text-warning" />}
          iconBgColor="bg-warning"
          change={0}
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Activity and Upcoming Events */}
        <div className="lg:col-span-2">
          <RecentActivities />
          <UpcomingEvents />
        </div>

        {/* Sidebar Content - Tasks and Announcements */}
        <div>
          <TasksComponent />
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
