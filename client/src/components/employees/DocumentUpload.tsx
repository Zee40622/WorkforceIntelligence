import { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Document } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, Trash2, Download, FileCheck, FileWarning, Calendar, FileClock } from "lucide-react";

// Extended document type with additional fields for UI
interface ExtendedDocument extends Document {
  fileSize?: string;
  permitNumber?: string;
  country?: string;
  status?: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
}

interface DocumentUploadProps {
  employeeId: number;
}

type DocumentType = 'contract' | 'certification' | 'id_proof' | 'work_permit' | 'visa' | 'medical_record' | 'recommendation' | 'other';

interface DocumentUploadFormData {
  employeeId: number;
  name: string;
  type: DocumentType;
  file: File | null;
}

const DocumentUpload = ({ employeeId }: DocumentUploadProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorkPermitDialogOpen, setIsWorkPermitDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DocumentUploadFormData>({
    employeeId,
    name: "",
    type: "contract",
    file: null,
  });
  
  const [workPermitData, setWorkPermitData] = useState({
    permitNumber: "",
    issueDate: "",
    expiryDate: "",
    country: "",
    type: "work_permit",
    status: "active",
    notes: "",
    documentFile: null as File | null
  });

  // Fetch documents
  const { data: documents } = useQuery<Document[]>({
    queryKey: [`/api/employees/${employeeId}/documents`],
  });

  // Upload document mutation
  const uploadDocument = useMutation({
    mutationFn: async (data: DocumentUploadFormData) => {
      // In a real app, you would upload the file to a storage service
      // and then save the metadata in the database
      const document = {
        employeeId: data.employeeId,
        name: data.name,
        type: data.type,
        fileUrl: data.file ? URL.createObjectURL(data.file) : null,
        fileSize: data.file ? `${Math.round(data.file.size / 1024)} KB` : null,
        uploadDate: new Date().toISOString(),
      };
      
      return apiRequest("POST", "/api/documents", document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/documents`] });
      toast({
        title: "Document uploaded",
        description: "The document has been uploaded successfully"
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to upload document",
        description: error.message,
      });
    },
  });

  // Upload work permit mutation
  const uploadWorkPermit = useMutation({
    mutationFn: async (data: typeof workPermitData) => {
      // In a real app, you would upload the file to a storage service
      // and then save the metadata in the database
      const document = {
        employeeId,
        name: `Work Permit - ${data.permitNumber}`,
        type: data.type,
        permitNumber: data.permitNumber,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate,
        country: data.country,
        status: data.status,
        notes: data.notes,
        fileUrl: data.documentFile ? URL.createObjectURL(data.documentFile) : null,
        fileSize: data.documentFile ? `${Math.round(data.documentFile.size / 1024)} KB` : null,
        uploadDate: new Date().toISOString(),
      };
      
      return apiRequest("POST", "/api/documents", document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/documents`] });
      toast({
        title: "Work Permit Uploaded",
        description: "The work permit has been uploaded successfully"
      });
      setIsWorkPermitDialogOpen(false);
      resetWorkPermitForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to upload work permit",
        description: error.message,
      });
    },
  });

  // Delete document mutation
  const deleteDocument = useMutation({
    mutationFn: async (documentId: number) => {
      return apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/documents`] });
      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete document",
        description: error.message,
      });
    },
  });

  const handleDocumentUpload = () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a document name",
      });
      return;
    }

    if (!formData.file) {
      toast({
        variant: "destructive",
        title: "Missing file",
        description: "Please select a file to upload",
      });
      return;
    }

    uploadDocument.mutate(formData);
  };

  const handleWorkPermitUpload = () => {
    if (!workPermitData.permitNumber || !workPermitData.issueDate || !workPermitData.expiryDate || !workPermitData.country) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide all required work permit details",
      });
      return;
    }

    if (!workPermitData.documentFile) {
      toast({
        variant: "destructive",
        title: "Missing file",
        description: "Please select a work permit document to upload",
      });
      return;
    }

    uploadWorkPermit.mutate(workPermitData);
  };

  const handleDeleteDocument = (documentId: number) => {
    deleteDocument.mutate(documentId);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleWorkPermitFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWorkPermitData({ ...workPermitData, documentFile: e.target.files[0] });
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId,
      name: "",
      type: "contract",
      file: null,
    });
  };

  const resetWorkPermitForm = () => {
    setWorkPermitData({
      permitNumber: "",
      issueDate: "",
      expiryDate: "",
      country: "",
      type: "work_permit",
      status: "active",
      notes: "",
      documentFile: null
    });
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'certification':
        return <FileCheck className="h-4 w-4 text-success" />;
      case 'work_permit':
        return <FileClock className="h-4 w-4 text-warning" />;
      case 'visa':
        return <FileWarning className="h-4 w-4 text-info" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'contract':
        return 'Employment Contract';
      case 'certification':
        return 'Certification';
      case 'id_proof':
        return 'ID Proof';
      case 'work_permit':
        return 'Work Permit';
      case 'visa':
        return 'Visa';
      case 'medical_record':
        return 'Medical Record';
      case 'recommendation':
        return 'Recommendation';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Employee Documents</CardTitle>
        <div className="flex gap-2">
          <Dialog open={isWorkPermitDialogOpen} onOpenChange={setIsWorkPermitDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <FileClock className="h-4 w-4" />
                <span>Work Permit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Work Permit</DialogTitle>
                <DialogDescription>
                  Add a new work permit document for this employee.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="permitNumber">Permit Number</Label>
                    <Input
                      id="permitNumber"
                      placeholder="WP-12345678"
                      value={workPermitData.permitNumber}
                      onChange={(e) => setWorkPermitData({ ...workPermitData, permitNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country of issue"
                      value={workPermitData.country}
                      onChange={(e) => setWorkPermitData({ ...workPermitData, country: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={workPermitData.issueDate}
                      onChange={(e) => setWorkPermitData({ ...workPermitData, issueDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={workPermitData.expiryDate}
                      onChange={(e) => setWorkPermitData({ ...workPermitData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={workPermitData.status} 
                    onValueChange={(value) => setWorkPermitData({ ...workPermitData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="revoked">Revoked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Additional information"
                    value={workPermitData.notes}
                    onChange={(e) => setWorkPermitData({ ...workPermitData, notes: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="documentFile">Upload Document</Label>
                  <Input
                    id="documentFile"
                    type="file"
                    onChange={handleWorkPermitFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload the work permit document (PDF, JPG, or PNG)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsWorkPermitDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleWorkPermitUpload} className="gap-1">
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <UploadCloud className="h-4 w-4" />
                <span>Upload Document</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Add a new document for this employee.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    placeholder="Employment Contract 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: DocumentType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Employment Contract</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                      <SelectItem value="id_proof">ID Proof</SelectItem>
                      <SelectItem value="medical_record">Medical Record</SelectItem>
                      <SelectItem value="recommendation">Recommendation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Upload File</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a document (PDF, DOC, JPG, or PNG)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDocumentUpload} className="gap-1">
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="flex items-center gap-2">
                    {getDocumentTypeIcon(document.type)}
                    <span>{document.name}</span>
                  </TableCell>
                  <TableCell>{getDocumentTypeLabel(document.type)}</TableCell>
                  <TableCell>{formatDate(document.uploadDate)}</TableCell>
                  <TableCell>{document.fileSize}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No documents yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Upload documents like contracts, certifications, and work permits for this employee.
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="gap-1">
              <UploadCloud className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        )}

        {/* Show work permit details if available */}
        {documents && documents.filter(doc => doc.type === 'work_permit').length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Work Permit Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.filter(doc => doc.type === 'work_permit').map((permit) => (
                <Card key={`permit-${permit.id}`} className="bg-orange-50 border-orange-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{permit.name}</h4>
                        <p className="text-sm text-muted-foreground">{permit.permitNumber}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDocument(permit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Country</p>
                        <p className="text-sm font-medium">{permit.country}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-medium capitalize">{permit.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Issue Date</p>
                        <p className="text-sm font-medium">{formatDate(permit.issueDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expiry Date</p>
                        <p className="text-sm font-medium">{formatDate(permit.expiryDate)}</p>
                      </div>
                    </div>
                    {permit.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="text-sm">{permit.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;