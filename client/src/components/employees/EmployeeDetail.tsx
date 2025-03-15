import React, { useState } from "react";
import { Employee } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, CheckCircle, Upload, AlertTriangle, Clock, Shield, FileText, Download } from "lucide-react";

interface EmployeeDetailProps {
  employee: Employee;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);
  const [isPermitDialogOpen, setIsPermitDialogOpen] = useState(false);

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

  // Sample document data
  const documents = [
    { id: 1, name: "Employment Contract.pdf", date: "2023-01-15", status: "approved" },
    { id: 2, name: "NDA.pdf", date: "2023-01-15", status: "approved" },
    { id: 3, name: "Tax Form W-4.pdf", date: "2023-02-10", status: "approved" },
    { id: 4, name: "Professional Certification.pdf", date: "2023-06-22", status: "pending" }
  ];

  // Sample work permit data
  const permitDetails = {
    type: "Work Permit",
    number: "WP-" + (employee.id * 1000 + 5678),
    issueDate: "2023-02-01",
    expiryDate: "2025-02-01",
    status: "Active",
    country: "United States",
    restrictions: "None",
    renewalReminder: "60 days before expiry"
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="permits">Work Permits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
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
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Employee Documents</CardTitle>
                <Dialog open={isDocumentUploadOpen} onOpenChange={setIsDocumentUploadOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Upload size={16} />
                      <span>Upload Document</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Document</DialogTitle>
                      <DialogDescription>
                        Upload employment documents, certifications, or any other important files.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="documentType">Document Type</Label>
                        <select id="documentType" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                          <option value="contract">Employment Contract</option>
                          <option value="id">ID Document</option>
                          <option value="certificate">Certificate</option>
                          <option value="tax">Tax Document</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="file">File</Label>
                        <Input id="file" type="file" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input id="notes" placeholder="Add any notes about this document" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDocumentUploadOpen(false)}>Cancel</Button>
                      <Button type="submit" onClick={() => setIsDocumentUploadOpen(false)}>Upload</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      {doc.status === "approved" ? 
                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                        <Clock className="h-5 w-5 text-amber-500" />
                      }
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-neutral-medium">Uploaded: {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <FileText size={14} />
                        <span>View</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Download size={14} />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permits">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Work Permit Management</CardTitle>
                <Dialog open={isPermitDialogOpen} onOpenChange={setIsPermitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-1">
                      <Shield size={16} />
                      <span>Add Permit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Work Permit</DialogTitle>
                      <DialogDescription>
                        Enter work permit details for this employee
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="permitType">Permit Type</Label>
                          <select id="permitType" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                            <option value="work">Work Permit</option>
                            <option value="residence">Residence Permit</option>
                            <option value="visa">Work Visa</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="permitNumber">Permit Number</Label>
                          <Input id="permitNumber" placeholder="WP-12345678" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <div className="flex h-9 w-full rounded-md border border-input px-3 items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            <Input id="issueDate" type="date" className="border-0 p-0 focus-visible:ring-0" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <div className="flex h-9 w-full rounded-md border border-input px-3 items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            <Input id="expiryDate" type="date" className="border-0 p-0 focus-visible:ring-0" />
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" placeholder="Country of issue" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="restrictions">Restrictions (if any)</Label>
                        <Input id="restrictions" placeholder="Any work restrictions" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPermitDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" onClick={() => setIsPermitDialogOpen(false)}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{permitDetails.type}</h4>
                      <p className="text-sm text-neutral-medium">#{permitDetails.number}</p>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      {permitDetails.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-medium">Issue Date</p>
                      <p className="text-sm">{permitDetails.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-medium">Expiry Date</p>
                      <p className="text-sm">{permitDetails.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-medium">Country</p>
                      <p className="text-sm">{permitDetails.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-medium">Restrictions</p>
                      <p className="text-sm">{permitDetails.restrictions}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                  <div>
                    <p className="font-medium text-sm">Renewal Reminder</p>
                    <p className="text-xs">This permit will expire in 321 days. Renewal process should start {permitDetails.renewalReminder}.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDetail;
