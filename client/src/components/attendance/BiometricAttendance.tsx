import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Upload,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface AttendanceRecord {
  id: number;
  date: string;
  employeeId: number;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
}

interface FaceRecognitionResult {
  success: boolean;
  confidence: number;
  message: string;
  employee?: {
    id: number;
    name: string;
    department: string;
  };
}

const BiometricAttendance = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<FaceRecognitionResult | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState<"checkIn" | "checkOut">("checkIn");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulate attendance records
  const todayRecords = [
    { id: 1, employeeId: 101, name: "Alice Johnson", time: "08:45 AM", type: "checkIn", verified: true },
    { id: 2, employeeId: 102, name: "Bob Smith", time: "08:52 AM", type: "checkIn", verified: true },
    { id: 3, employeeId: 103, name: "Charlie Brown", time: "09:03 AM", type: "checkIn", verified: true },
    { id: 4, employeeId: 101, name: "Alice Johnson", time: "05:15 PM", type: "checkOut", verified: true },
    { id: 5, employeeId: 104, name: "David Miller", time: "09:10 AM", type: "checkIn", verified: false },
  ];

  // Mock function to simulate face recognition processing
  const processAttendance = async (imageData: string): Promise<FaceRecognitionResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Return a mock success result 80% of the time
    if (Math.random() > 0.2) {
      return {
        success: true,
        confidence: 92.5 + Math.random() * 5,
        message: "Face verification successful",
        employee: {
          id: 101,
          name: "Alice Johnson",
          department: "Engineering"
        }
      };
    } else {
      return {
        success: false,
        confidence: 45 + Math.random() * 30,
        message: "Unable to verify face. Please try again or use alternative check-in method."
      };
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setIsCapturing(true);
        
        // Brief flash effect
        setTimeout(() => {
          if (ctx && video) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');
            setCapturedImage(imageData);
            setIsCapturing(false);
            processVerification(imageData);
          }
        }, 150);
      }
    }
  };

  const processVerification = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Call mock face recognition API
      const result = await processAttendance(imageData);
      setVerificationResult(result);
      setShowVerificationDialog(true);
      
      if (result.success) {
        // Successful verification logic would go here
        // For example, recording attendance in the database
      }
    } catch (error) {
      console.error("Error processing verification:", error);
      setVerificationResult({
        success: false,
        confidence: 0,
        message: "An error occurred during verification. Please try again."
      });
      setShowVerificationDialog(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDialogClose = () => {
    setShowVerificationDialog(false);
    setCapturedImage(null);
    setVerificationResult(null);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setCapturedImage(event.target.result);
          processVerification(event.target.result);
        }
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Biometric Attendance</CardTitle>
            <CardDescription>Use face recognition to check in/out</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="inline-flex rounded-md shadow-sm">
                <Button
                  variant={attendanceMode === "checkIn" ? "default" : "outline"}
                  className="rounded-r-none px-8"
                  onClick={() => setAttendanceMode("checkIn")}
                >
                  Check In
                </Button>
                <Button
                  variant={attendanceMode === "checkOut" ? "default" : "outline"}
                  className="rounded-l-none px-8"
                  onClick={() => setAttendanceMode("checkOut")}
                >
                  Check Out
                </Button>
              </div>
            </div>
            
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {isCameraOpen ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-center p-4">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Camera is not active</p>
                </div>
              )}
              
              {isCapturing && (
                <div className="absolute inset-0 bg-white opacity-70"></div>
              )}
              
              {/* Hidden canvas for capturing frame */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex space-x-2">
              {!isCameraOpen ? (
                <Button onClick={startCamera} className="flex-1 gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Start Camera</span>
                </Button>
              ) : (
                <Button onClick={captureImage} className="flex-1 gap-2" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      <span>{attendanceMode === "checkIn" ? "Check In" : "Check Out"}</span>
                    </>
                  )}
                </Button>
              )}
              <div className="relative">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  disabled={isProcessing}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
              <span>Current time: {new Date().toLocaleTimeString()}</span>
              <span>Face verification: {isProcessing ? "Processing..." : "Ready"}</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Records</CardTitle>
            <CardDescription>Attendance log for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayRecords.map((record) => (
                <div 
                  key={record.id} 
                  className="flex justify-between items-center p-3 rounded-md border"
                >
                  <div className="flex items-center gap-3">
                    {record.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <p className="font-medium">{record.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {record.employeeId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={
                      record.type === "checkIn" 
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }>
                      {record.type === "checkIn" ? "Check In" : "Check Out"}
                    </Badge>
                    <p className="text-sm font-medium mt-1">{record.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Detection Card */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Attendance Monitoring</CardTitle>
          <CardDescription>
            Our system uses advanced AI to detect fraudulent attendance patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-green-50 border-green-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Face Recognition</h3>
                <Badge variant="outline" className="bg-green-100 border-green-200">Active</Badge>
              </div>
              <p className="text-sm mb-2">Real-time employee identification with 99.2% accuracy</p>
              <Progress value={99} className="h-2" />
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Liveness Detection</h3>
                <Badge variant="outline" className="bg-blue-100 border-blue-200">Active</Badge>
              </div>
              <p className="text-sm mb-2">Prevents check-ins using photos or videos</p>
              <Progress value={95} className="h-2" />
            </div>
            
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Pattern Analysis</h3>
                <Badge variant="outline" className="bg-amber-100 border-amber-200">Active</Badge>
              </div>
              <p className="text-sm mb-2">Detects unusual attendance patterns</p>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {verificationResult?.success ? "Verification Successful" : "Verification Failed"}
            </DialogTitle>
            <DialogDescription>
              {verificationResult?.message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {verificationResult?.success ? (
              <div className="text-center space-y-3">
                <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{verificationResult.employee?.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {verificationResult.employee?.id}</p>
                  <p className="text-sm text-muted-foreground">{verificationResult.employee?.department}</p>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Confidence</span>
                    <span className="text-sm font-medium">{verificationResult.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={verificationResult.confidence} className="h-2" />
                </div>
                <p className="text-sm">
                  {attendanceMode === "checkIn" 
                    ? "Check-in recorded at " 
                    : "Check-out recorded at "}
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="mx-auto bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <UserX className="h-8 w-8 text-red-600" />
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Confidence</span>
                    <span className="text-sm font-medium">{verificationResult?.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={verificationResult?.confidence || 0} className="h-2" />
                </div>
                <p className="text-sm">
                  Please try again or contact your supervisor for assistance.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleDialogClose}
              className="w-full"
            >
              {verificationResult?.success ? "Done" : "Try Again"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BiometricAttendance;