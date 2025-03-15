import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Target, Award, Calendar, BarChart4Icon, FileEdit, File, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Performance } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Assuming we're viewing the employee with ID 1
  const employeeId = 1;
  
  // Fetch performance data
  const { data: performanceData, isLoading } = useQuery<Performance[]>({
    queryKey: [`/api/employees/${employeeId}/performance`],
  });

  // Sample data for charts (in a real app, this would come from the API)
  const quarterlyRatings = [
    { quarter: "Q1", rating: 4.2 },
    { quarter: "Q2", rating: 4.5 },
    { quarter: "Q3", rating: 4.3 },
    { quarter: "Q4", rating: 4.7 },
  ];

  const skillsData = [
    { skill: "Communication", score: 85 },
    { skill: "Technical", score: 90 },
    { skill: "Teamwork", score: 75 },
    { skill: "Leadership", score: 70 },
    { skill: "Problem Solving", score: 80 },
  ];

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Calculate average rating
  const averageRating = performanceData && performanceData.length > 0
    ? (performanceData.reduce((sum, review) => sum + Number(review.rating || 0), 0) / performanceData.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-dark">Performance Management</h2>
          <Button>
            <FileEdit className="mr-2 h-4 w-4" />
            New Review
          </Button>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          Track employee performance, reviews, and goal settings
        </p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <div className="flex items-center text-xs text-success">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              <span>+0.3 from last year</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total reviews</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Set</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dec 15</div>
            <p className="text-xs text-muted-foreground">30 days left</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Performance Data */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={quarterlyRatings}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#1976d2"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Skills Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Skills Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={skillsData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 70,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="skill" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Bar dataKey="score" fill="#1976d2" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading performance data...</div>
              ) : performanceData && performanceData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.period}</TableCell>
                        <TableCell>{formatDate(review.reviewDate)}</TableCell>
                        <TableCell>Reviewer #{review.reviewerId}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary-light text-primary">
                            {review.rating ? review.rating.toString() : "N/A"}/5
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {review.comments || "No comments provided"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4">No performance reviews found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <BarChart4Icon className="h-16 w-16 mx-auto text-neutral-medium opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No Goals Set</h3>
                <p className="mt-2 text-neutral-medium">
                  You haven't set any performance goals yet. Goals help you track progress towards professional development.
                </p>
                <Button className="mt-4">
                  <Target className="mr-2 h-4 w-4" />
                  Set New Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformancePage;
