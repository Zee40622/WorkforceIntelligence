import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, PlusIcon, Users, Calendar, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const RecruitmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  
  // Sample job listings (in a real app, this would come from the API)
  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      applicants: 24,
      status: "active",
      posted: "2023-10-15",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      applicants: 18,
      status: "active",
      posted: "2023-10-18",
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time",
      applicants: 12,
      status: "closed",
      posted: "2023-09-05",
    },
    {
      id: 4,
      title: "Customer Support Specialist",
      department: "Customer Success",
      location: "Chicago, IL",
      type: "Full-time",
      applicants: 8,
      status: "active",
      posted: "2023-10-20",
    },
    {
      id: 5,
      title: "Data Analyst",
      department: "Business Intelligence",
      location: "Remote",
      type: "Full-time",
      applicants: 15,
      status: "active",
      posted: "2023-10-12",
    },
  ];

  // Sample applicants data
  const applicants = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "Senior Software Engineer",
      appliedDate: "2023-10-16",
      status: "interview",
      stage: 75,
    },
    {
      id: 2,
      name: "Maya Rodriguez",
      position: "UX/UI Designer",
      appliedDate: "2023-10-19",
      status: "review",
      stage: 40,
    },
    {
      id: 3,
      name: "David Lee",
      position: "Senior Software Engineer",
      appliedDate: "2023-10-17",
      status: "new",
      stage: 10,
    },
    {
      id: 4,
      name: "Sarah Williams",
      position: "Data Analyst",
      appliedDate: "2023-10-14",
      status: "offer",
      stage: 90,
    },
    {
      id: 5,
      name: "James Smith",
      position: "Customer Support Specialist",
      appliedDate: "2023-10-21",
      status: "new",
      stage: 10,
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days since posting
  const getDaysSincePosting = (dateString: string) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge for job listings
  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success bg-opacity-10 text-success">
            Active
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-neutral-medium bg-opacity-10 text-neutral-dark">
            Closed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-primary bg-opacity-10 text-primary">
            {status}
          </Badge>
        );
    }
  };

  // Get status badge for applicants
  const getApplicantStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-primary bg-opacity-10 text-primary">
            New
          </Badge>
        );
      case "review":
        return (
          <Badge className="bg-warning bg-opacity-10 text-warning">
            In Review
          </Badge>
        );
      case "interview":
        return (
          <Badge className="bg-info bg-opacity-10 text-info">
            Interview
          </Badge>
        );
      case "offer":
        return (
          <Badge className="bg-success bg-opacity-10 text-success">
            Offer
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-error bg-opacity-10 text-error">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-neutral-medium bg-opacity-10 text-neutral-dark">
            {status}
          </Badge>
        );
    }
  };

  // Active jobs count
  const activeJobsCount = jobListings.filter(job => job.status === "active").length;
  
  // Total applicants count
  const totalApplicantsCount = applicants.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-dark">Recruitment</h2>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Job Posting
          </Button>
        </div>
        <p className="mt-1 text-sm text-neutral-medium">
          Manage job postings, applicants, and the hiring process
        </p>
      </div>

      {/* Recruitment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobsCount}</div>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicantsCount}</div>
            <p className="text-xs text-muted-foreground">Across all positions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time to Hire</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 days</div>
            <p className="text-xs text-muted-foreground">Down from 40 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiring Success Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">YTD average</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Recruitment Data */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
          <TabsTrigger value="pipeline">Hiring Pipeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Active & Recent Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobListings.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.applicants}</TableCell>
                      <TableCell>{getJobStatusBadge(job.status)}</TableCell>
                      <TableCell>{`${formatDate(job.posted)} (${getDaysSincePosting(job.posted)} days)`}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Applicant Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.name}</TableCell>
                      <TableCell>{applicant.position}</TableCell>
                      <TableCell>{formatDate(applicant.appliedDate)}</TableCell>
                      <TableCell>{getApplicantStatusBadge(applicant.status)}</TableCell>
                      <TableCell className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <Progress value={applicant.stage} className="h-2" />
                          <span className="text-xs text-neutral-medium">{applicant.stage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Hiring Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">New Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">8</div>
                    <div className="mt-4 space-y-2">
                      {applicants
                        .filter(a => a.status === "new")
                        .slice(0, 3)
                        .map((applicant) => (
                          <div key={applicant.id} className="text-sm py-1 border-b last:border-b-0">
                            {applicant.name} - {applicant.position}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">In Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">5</div>
                    <div className="mt-4 space-y-2">
                      {applicants
                        .filter(a => a.status === "review")
                        .slice(0, 3)
                        .map((applicant) => (
                          <div key={applicant.id} className="text-sm py-1 border-b last:border-b-0">
                            {applicant.name} - {applicant.position}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Interview Stage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">3</div>
                    <div className="mt-4 space-y-2">
                      {applicants
                        .filter(a => a.status === "interview")
                        .slice(0, 3)
                        .map((applicant) => (
                          <div key={applicant.id} className="text-sm py-1 border-b last:border-b-0">
                            {applicant.name} - {applicant.position}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Offer Stage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">2</div>
                    <div className="mt-4 space-y-2">
                      {applicants
                        .filter(a => a.status === "offer")
                        .slice(0, 3)
                        .map((applicant) => (
                          <div key={applicant.id} className="text-sm py-1 border-b last:border-b-0">
                            {applicant.name} - {applicant.position}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruitmentPage;
