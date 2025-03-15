import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@shared/schema";

const RecentActivities: React.FC = () => {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities/recent"],
  });

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-warning bg-opacity-10 text-warning border-warning">
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary border-primary">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-success bg-opacity-10 text-success border-success">
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-error bg-opacity-10 text-error border-error">
            Rejected
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

  // Function to format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const activityDate = new Date(date);
    
    // Check if today
    if (activityDate.toDateString() === now.toDateString()) {
      return `Today, ${activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (activityDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return formatted date
    return activityDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           `, ${activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
        <button className="text-sm text-primary hover:text-primary-dark">
          View all
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <table className="min-w-full data-table">
            <thead>
              <tr className="border-b border-neutral-light">
                <th className="py-3 text-xs text-neutral-medium uppercase tracking-wider text-left">
                  Employee
                </th>
                <th className="py-3 text-xs text-neutral-medium uppercase tracking-wider text-left">
                  Activity
                </th>
                <th className="py-3 text-xs text-neutral-medium uppercase tracking-wider text-left">
                  Date
                </th>
                <th className="py-3 text-xs text-neutral-medium uppercase tracking-wider text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    Loading activities...
                  </td>
                </tr>
              ) : activities && activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-neutral-light">
                    <td className="py-3">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {activity.employeeId.toString().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Employee #{activity.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{activity.description}</td>
                    <td className="py-3 text-sm text-neutral-medium">
                      {formatDate(activity.date)}
                    </td>
                    <td className="py-3">
                      {getStatusBadge(activity.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No recent activities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
