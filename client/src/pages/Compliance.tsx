import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  File,
  FileText,
  Filter,
  Download,
  Calendar as CalendarIcon,
  Bell,
  Search,
  ArrowUpRight,
  Globe,
  Shield,
  FileCog,
  BookOpen,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

// Sample regulations data
const regulations = [
  {
    id: 1,
    name: "GDPR Compliance",
    description: "General Data Protection Regulation requirements and standards",
    category: "Data Privacy",
    complianceLevel: 92,
    lastAudit: "2025-02-15",
    nextAudit: "2025-08-15",
    status: "compliant",
    country: "European Union",
    documents: 8,
  },
  {
    id: 2,
    name: "CCPA Compliance",
    description: "California Consumer Privacy Act regulations",
    category: "Data Privacy",
    complianceLevel: 85,
    lastAudit: "2025-01-20",
    nextAudit: "2025-07-20",
    status: "action_required",
    country: "United States",
    documents: 6,
  },
  {
    id: 3,
    name: "ADA Compliance",
    description: "Americans with Disabilities Act requirements for workplace",
    category: "Workplace",
    complianceLevel: 95,
    lastAudit: "2025-03-05",
    nextAudit: "2025-09-05",
    status: "compliant",
    country: "United States",
    documents: 4,
  },
  {
    id: 4,
    name: "FLSA Compliance",
    description: "Fair Labor Standards Act regulations for wages and hours",
    category: "Labor",
    complianceLevel: 78,
    lastAudit: "2025-02-28",
    nextAudit: "2025-04-15",
    status: "action_required",
    country: "United States",
    documents: 7,
  },
  {
    id: 5,
    name: "ISO 27001",
    description: "Information security management standards",
    category: "Data Security",
    complianceLevel: 88,
    lastAudit: "2025-01-10",
    nextAudit: "2025-07-10",
    status: "compliant",
    country: "International",
    documents: 12,
  },
];

// Sample permits data
const workPermits = [
  {
    id: 1,
    employeeId: 156,
    employeeName: "Maria Rodriguez",
    permitType: "H-1B Visa",
    issueDate: "2023-08-15",
    expiryDate: "2026-08-14",
    status: "active",
    country: "United States",
    daysRemaining: 518,
  },
  {
    id: 2,
    employeeId: 203,
    employeeName: "Jin Wei",
    permitType: "Work Permit",
    issueDate: "2024-01-20",
    expiryDate: "2025-07-19",
    status: "active",
    country: "Canada",
    daysRemaining: 128,
  },
  {
    id: 3,
    employeeId: 187,
    employeeName: "Ahmed Hassan",
    permitType: "Blue Card",
    issueDate: "2023-05-10",
    expiryDate: "2025-05-09",
    status: "renewal_required",
    country: "Germany",
    daysRemaining: 57,
  },
  {
    id: 4,
    employeeId: 221,
    employeeName: "Sophia Nowak",
    permitType: "Work Visa",
    issueDate: "2024-02-25",
    expiryDate: "2026-02-24",
    status: "active",
    country: "Australia",
    daysRemaining: 343,
  },
  {
    id: 5,
    employeeId: 142,
    employeeName: "Carlos Mendez",
    permitType: "H-1B Visa",
    issueDate: "2022-11-30",
    expiryDate: "2025-04-15",
    status: "renewal_required",
    country: "United States",
    daysRemaining: 33,
  },
];

// Sample policies data
const policies = [
  {
    id: 1,
    name: "Employee Code of Conduct",
    category: "General",
    lastUpdated: "2025-01-15",
    version: "3.2",
    status: "active",
    acknowledgmentRate: 94,
  },
  {
    id: 2,
    name: "Anti-Harassment Policy",
    category: "Workplace",
    lastUpdated: "2024-11-20",
    version: "2.1",
    status: "active",
    acknowledgmentRate: 89,
  },
  {
    id: 3,
    name: "Remote Work Policy",
    category: "Work Arrangement",
    lastUpdated: "2025-02-28",
    version: "4.0",
    status: "under_review",
    acknowledgmentRate: 76,
  },
  {
    id: 4,
    name: "Data Protection Policy",
    category: "IT & Security",
    lastUpdated: "2025-03-10",
    version: "3.5",
    status: "active",
    acknowledgmentRate: 91,
  },
  {
    id: 5,
    name: "Travel & Expense Policy",
    category: "Finance",
    lastUpdated: "2024-10-05",
    version: "2.3",
    status: "active",
    acknowledgmentRate: 82,
  },
];

// Sample compliance alerts
const complianceAlerts = [
  {
    id: 1,
    title: "CCPA Documentation Update Required",
    description: "Update privacy policies to comply with new CCPA amendments by April 30th",
    dueDate: "2025-04-30",
    priority: "high",
    category: "Data Privacy",
    status: "open",
  },
  {
    id: 2,
    title: "Work Permit Expiring Soon",
    description: "Carlos Mendez's H-1B visa expires in 33 days. Start renewal process immediately.",
    dueDate: "2025-04-15",
    priority: "high",
    category: "Immigration",
    status: "open",
  },
  {
    id: 3,
    title: "Annual Harassment Training Due",
    description: "Complete mandatory anti-harassment training for all employees",
    dueDate: "2025-05-15",
    priority: "medium",
    category: "Workplace",
    status: "open",
  },
  {
    id: 4,
    title: "FLSA Compliance Audit",
    description: "Address wage classification issues identified in recent FLSA audit",
    dueDate: "2025-04-15",
    priority: "high",
    category: "Labor",
    status: "in_progress",
  },
  {
    id: 5,
    title: "Policy Acknowledgment Reminder",
    description: "Send reminder for employees to acknowledge updated Remote Work Policy",
    dueDate: "2025-04-10",
    priority: "medium",
    category: "General",
    status: "in_progress",
  },
];

// Recent updates
const recentUpdates = [
  {
    id: 1,
    title: "GDPR Update 2025",
    description: "New amendments to GDPR regulations affecting data retention policies",
    date: "2025-03-10",
    source: "European Data Protection Board",
    link: "#",
  },
  {
    id: 2,
    title: "California Privacy Rights Act",
    description: "CPRA enforcement begins with additional consumer privacy protections",
    date: "2025-03-05",
    source: "California Attorney General",
    link: "#",
  },
  {
    id: 3,
    title: "OSHA Policy Changes",
    description: "Updated workplace safety guidelines for hybrid work environments",
    date: "2025-02-28",
    source: "U.S. Department of Labor",
    link: "#",
  },
];

const CompliancePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegulation, setSelectedRegulation] = useState<number | null>(null);
  const [selectedPermit, setSelectedPermit] = useState<number | null>(null);
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false);

  const filteredRegulations = regulations.filter(
    reg => 
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPermits = workPermits.filter(
    permit => 
      permit.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.permitType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPolicies = policies.filter(
    policy => 
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Compliant
          </Badge>
        );
      case "action_required":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Action Required
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "renewal_required":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Renewal Required
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-800 border-neutral-200">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-100 text-neutral-800 border-neutral-200">
            {priority}
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const handlePermitRenewal = () => {
    // Logic to process permit renewal would go here
    console.log("Processing renewal for permit ID:", selectedPermit);
    setIsRenewalDialogOpen(false);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Compliance & Legal Management</h1>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search compliance..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Bell size={16} />
            <span>Alerts</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="permits">Work Permits</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  Overall compliance across all regulations
                </p>
                <div className="mt-4 h-2">
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">
                  +3% improvement since last month
                </p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Regulations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Regulations actively monitored
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-xs">
                    <div className="h-2 w-2 rounded-full mr-1 bg-green-500"></div>
                    <div className="flex-1">Compliant: 9</div>
                  </div>
                  <div className="flex items-center text-xs mt-1">
                    <div className="h-2 w-2 rounded-full mr-1 bg-amber-500"></div>
                    <div className="flex-1">Action Required: 3</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">
                  2 regulations added in last 90 days
                </p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  Compliance deadlines in next 30 days
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-xs">
                    <div className="h-2 w-2 rounded-full mr-1 bg-red-500"></div>
                    <div className="flex-1">High Priority: 3</div>
                  </div>
                  <div className="flex items-center text-xs mt-1">
                    <div className="h-2 w-2 rounded-full mr-1 bg-amber-500"></div>
                    <div className="flex-1">Medium Priority: 4</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" className="h-auto p-0 text-xs">
                  View all deadlines
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Alerts</CardTitle>
                <CardDescription>High priority items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceAlerts
                    .filter(alert => alert.priority === "high")
                    .slice(0, 3)
                    .map(alert => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-md">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{alert.title}</h4>
                            {getPriorityBadge(alert.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>Due: {alert.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("alerts")}>
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Regulatory Updates</CardTitle>
                <CardDescription>Latest changes in legislation and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map(update => (
                    <div key={update.id} className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{update.title}</h4>
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {update.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Source: {update.source}
                        </span>
                        <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                          <span className="text-xs">View Details</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("alerts")}>
                  View All Updates
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permit Expirations</CardTitle>
              <CardDescription>Work permits expiring within 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Permit Type</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workPermits
                    .filter(permit => permit.daysRemaining <= 90)
                    .map(permit => (
                      <TableRow key={permit.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{permit.employeeName}</div>
                            <div className="text-xs text-muted-foreground">ID: {permit.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{permit.permitType}</TableCell>
                        <TableCell>{permit.expiryDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            permit.daysRemaining <= 30 
                              ? "bg-red-100 text-red-800 border-red-200"
                              : permit.daysRemaining <= 60
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                          }>
                            {permit.daysRemaining} days
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(permit.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedPermit(permit.id);
                              setIsRenewalDialogOpen(true);
                            }}
                          >
                            Initiate Renewal
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance</CardTitle>
              <CardDescription>Tracking regulatory requirements across jurisdictions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Audit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegulations.map(regulation => (
                    <TableRow key={regulation.id}>
                      <TableCell>
                        <div className="font-medium">{regulation.name}</div>
                        <div className="text-xs text-muted-foreground">{regulation.description}</div>
                      </TableCell>
                      <TableCell>{regulation.category}</TableCell>
                      <TableCell>{regulation.country}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={regulation.complianceLevel} className="h-2 w-16" />
                          <span className="text-sm">{regulation.complianceLevel}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(regulation.status)}</TableCell>
                      <TableCell>{regulation.nextAudit}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedRegulation(regulation.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permits" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Permit Management</CardTitle>
              <CardDescription>Track and manage employee work permits and visas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Permit Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermits.map(permit => (
                    <TableRow key={permit.id}>
                      <TableCell>
                        <div className="font-medium">{permit.employeeName}</div>
                        <div className="text-xs text-muted-foreground">ID: {permit.employeeId}</div>
                      </TableCell>
                      <TableCell>{permit.permitType}</TableCell>
                      <TableCell>{permit.country}</TableCell>
                      <TableCell>{permit.issueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{permit.expiryDate}</span>
                          {permit.daysRemaining <= 60 && (
                            <Badge variant="outline" className={
                              permit.daysRemaining <= 30 
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }>
                              {permit.daysRemaining} days
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(permit.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              if (permit.status === "renewal_required" || permit.daysRemaining <= 60) {
                                setSelectedPermit(permit.id);
                                setIsRenewalDialogOpen(true);
                              }
                            }}
                          >
                            {permit.status === "renewal_required" || permit.daysRemaining <= 60 
                              ? "Renew" 
                              : "View"
                            }
                          </Button>
                          <Button variant="outline" size="sm">Documents</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Policies and Procedures</CardTitle>
              <CardDescription>Manage internal policies and employee acknowledgments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acknowledgment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map(policy => (
                    <TableRow key={policy.id}>
                      <TableCell>
                        <div className="font-medium">{policy.name}</div>
                      </TableCell>
                      <TableCell>{policy.category}</TableCell>
                      <TableCell>{policy.lastUpdated}</TableCell>
                      <TableCell>v{policy.version}</TableCell>
                      <TableCell>{getStatusBadge(policy.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={policy.acknowledgmentRate} className="h-2 w-16" />
                          <span className="text-sm">{policy.acknowledgmentRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <FileText size={14} />
                            <span>View</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download size={14} />
                            <span>Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Alerts</CardTitle>
                <CardDescription>Action items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceAlerts.map(alert => (
                    <div key={alert.id} className="p-3 border rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(alert.status)}
                        <h4 className="font-medium">{alert.title}</h4>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                          <span>Due: {alert.dueDate}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Updates</CardTitle>
                <CardDescription>Recent changes in legislation and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map(update => (
                    <div key={update.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">{update.title}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {update.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Source: {update.source}
                        </span>
                        <Button variant="link" size="sm" className="h-auto p-0 gap-1">
                          <span className="text-xs">Read More</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View More Updates
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Calendar</CardTitle>
              <CardDescription>Upcoming deadlines and important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 border rounded-md bg-red-50 border-red-100">
                  <CalendarIcon className="h-5 w-5 text-red-500 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Work Permit Renewal: Carlos Mendez</h4>
                      <span className="text-sm">April 15, 2025</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      H-1B Visa renewal must be initiated 33 days before expiration
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md bg-amber-50 border-amber-100">
                  <CalendarIcon className="h-5 w-5 text-amber-500 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">CCPA Documentation Deadline</h4>
                      <span className="text-sm">April 30, 2025</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Update all privacy policies to reflect CCPA amendments
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <CalendarIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Anti-Harassment Training Due</h4>
                      <span className="text-sm">May 15, 2025</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mandatory training for all employees
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <CalendarIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Quarterly Compliance Review</h4>
                      <span className="text-sm">June 30, 2025</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Review and update all compliance documentation
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Work Permit Renewal Dialog */}
      <Dialog open={isRenewalDialogOpen} onOpenChange={setIsRenewalDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Initiate Work Permit Renewal</DialogTitle>
            <DialogDescription>
              Start the renewal process for the selected work permit
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedPermit && (
              <div className="p-3 border rounded-md bg-muted">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Employee:</p>
                    <p>{workPermits.find(p => p.id === selectedPermit)?.employeeName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Permit Type:</p>
                    <p>{workPermits.find(p => p.id === selectedPermit)?.permitType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Country:</p>
                    <p>{workPermits.find(p => p.id === selectedPermit)?.country}</p>
                  </div>
                  <div>
                    <p className="font-medium">Expiry Date:</p>
                    <p>{workPermits.find(p => p.id === selectedPermit)?.expiryDate}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="renewalDate">Renewal Initiation Date</Label>
              <div className="flex h-9 w-full rounded-md border border-input px-3 items-center">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                <Input id="renewalDate" type="date" className="border-0 p-0 focus-visible:ring-0" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any special instructions or requirements for the renewal process" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assign To</Label>
              <select id="assignee" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option value="hr">HR Department</option>
                <option value="legal">Legal Department</option>
                <option value="sarah">Sarah Johnson (Immigration Specialist)</option>
                <option value="michael">Michael Chen (Legal Counsel)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenewalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePermitRenewal}>
              Initiate Renewal Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompliancePage;