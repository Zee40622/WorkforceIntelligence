import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, Languages, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// This would normally be integrated with a real speech recognition and synthesis API
// For prototype, we're simulating this functionality

interface VoiceAttendanceProps {
  employeeId: number;
}

type LanguageOption = {
  code: string;
  name: string;
  welcomeText: string;
  checkInText: string;
  checkOutText: string;
  successText: string;
};

const languages: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    welcomeText: "Welcome to voice attendance system. How can I help you today?",
    checkInText: "Checking you in for today. Please confirm your name.",
    checkOutText: "Checking you out for today. Please confirm your name.",
    successText: "Thank you. Your attendance has been recorded successfully.",
  },
  {
    code: "es",
    name: "Spanish",
    welcomeText: "Bienvenido al sistema de asistencia por voz. ¿Cómo puedo ayudarte hoy?",
    checkInText: "Registrando tu entrada para hoy. Por favor, confirma tu nombre.",
    checkOutText: "Registrando tu salida para hoy. Por favor, confirma tu nombre.",
    successText: "Gracias. Tu asistencia ha sido registrada con éxito.",
  },
  {
    code: "fr",
    name: "French",
    welcomeText: "Bienvenue dans le système de présence vocale. Comment puis-je vous aider aujourd'hui?",
    checkInText: "Je vous enregistre pour aujourd'hui. Veuillez confirmer votre nom.",
    checkOutText: "Je vous déconnecte pour aujourd'hui. Veuillez confirmer votre nom.",
    successText: "Merci. Votre présence a été enregistrée avec succès.",
  },
  {
    code: "de",
    name: "German",
    welcomeText: "Willkommen beim Sprachanwesenheitssystem. Wie kann ich Ihnen heute helfen?",
    checkInText: "Ich melde Sie für heute an. Bitte bestätigen Sie Ihren Namen.",
    checkOutText: "Ich melde Sie für heute ab. Bitte bestätigen Sie Ihren Namen.",
    successText: "Danke. Ihre Anwesenheit wurde erfolgreich erfasst.",
  },
  {
    code: "zh",
    name: "Chinese",
    welcomeText: "欢迎使用语音考勤系统。今天需要什么帮助？",
    checkInText: "正在为您签到。请确认您的姓名。",
    checkOutText: "正在为您签退。请确认您的姓名。",
    successText: "谢谢。您的考勤已成功记录。",
  },
];

const VoiceAttendance: React.FC<VoiceAttendanceProps> = ({ employeeId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [action, setAction] = useState<"check-in" | "check-out" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [voiceOutput, setVoiceOutput] = useState("");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check-in mutation
  const checkIn = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/attendance", {
        employeeId,
        date: new Date(),
        checkIn: new Date(),
        status: "present"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/attendance`] });
      toast({
        title: "Voice Check-in",
        description: "Your check-in has been recorded"
      });
      speakText(getCurrentLanguage().successText);
      setAction(null);
      setProcessing(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to check in",
        description: error.message
      });
      setProcessing(false);
    }
  });

  // Check-out mutation
  const checkOut = useMutation({
    mutationFn: async () => {
      // For simplicity in the prototype, we're not checking if there's an existing attendance record
      // In a real app, you'd first fetch the latest attendance record and then update it
      return apiRequest("POST", "/api/attendance", {
        employeeId,
        date: new Date(),
        checkOut: new Date(),
        status: "present"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}/attendance`] });
      toast({
        title: "Voice Check-out",
        description: "Your check-out has been recorded"
      });
      speakText(getCurrentLanguage().successText);
      setAction(null);
      setProcessing(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to check out",
        description: error.message
      });
      setProcessing(false);
    }
  });

  // Get current language object
  const getCurrentLanguage = (): LanguageOption => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  };

  // Simulating speech recognition
  const startListening = () => {
    setIsListening(true);
    setTranscript("");
    setProgress(0);
    
    // Simulate progress
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + 5;
        if (newValue >= 100) {
          stopListening();
          return 100;
        }
        return newValue;
      });
    }, 150);
    
    // Simulate someone saying "Check in" or "Check out" after 3 seconds
    setTimeout(() => {
      if (action === "check-in") {
        setTranscript("Check in for John Smith");
      } else if (action === "check-out") {
        setTranscript("Check out for John Smith");
      }
      stopListening();
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Process the voice command if we have an action set
    if (action) {
      processCommand();
    }
  };

  // Text-to-speech simulation
  const speakText = (text: string) => {
    setVoiceOutput(text);
    
    // In a real implementation, we would use the Web Speech API:
    // const speech = new SpeechSynthesisUtterance(text);
    // speech.lang = selectedLanguage;
    // window.speechSynthesis.speak(speech);
  };

  // Process voice command
  const processCommand = () => {
    setProcessing(true);
    
    if (action === "check-in") {
      // In a real app, this would analyze the transcript and verify the employee
      setTimeout(() => {
        checkIn.mutate();
      }, 1500);
    } else if (action === "check-out") {
      setTimeout(() => {
        checkOut.mutate();
      }, 1500);
    }
  };

  // Initiate check-in process
  const handleCheckIn = () => {
    setAction("check-in");
    speakText(getCurrentLanguage().checkInText);
    startListening();
  };

  // Initiate check-out process
  const handleCheckOut = () => {
    setAction("check-out");
    speakText(getCurrentLanguage().checkOutText);
    startListening();
  };

  // Change language
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    speakText(languages.find(l => l.code === lang)?.welcomeText || "");
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Initial welcome message
  useEffect(() => {
    // Set a small delay to make it feel more natural
    const timer = setTimeout(() => {
      speakText(getCurrentLanguage().welcomeText);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">AI Voice Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={selectedLanguage} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => speakText(getCurrentLanguage().welcomeText)}
            disabled={isListening || processing}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
        
        <div className="bg-secondary p-4 rounded-md min-h-[100px] flex flex-col items-center justify-center text-center relative">
          {voiceOutput && (
            <div className="flex items-start mb-3">
              <div className="bg-primary-light rounded-md p-2 text-white text-sm max-w-[80%]">
                <p>{voiceOutput}</p>
              </div>
            </div>
          )}
          
          {isListening && (
            <div className="absolute inset-0 bg-secondary bg-opacity-90 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3 animate-pulse">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm mb-3">Listening...</p>
              <div className="w-[80%] mb-2">
                <Progress value={progress} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={stopListening}
                className="gap-1"
              >
                <MicOff className="h-4 w-4" />
                <span>Stop</span>
              </Button>
            </div>
          )}
          
          {processing && (
            <div className="absolute inset-0 bg-secondary bg-opacity-90 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-3">
                <RefreshCw className="h-6 w-6 text-white animate-spin" />
              </div>
              <p className="text-sm">Processing your request...</p>
            </div>
          )}
          
          {transcript && !isListening && !processing && (
            <div className="flex items-end justify-end w-full">
              <div className="bg-muted rounded-md p-2 text-sm max-w-[80%]">
                <p className="italic">{transcript}</p>
              </div>
            </div>
          )}
          
          {!isListening && !processing && !transcript && !voiceOutput && (
            <div className="text-center text-muted-foreground">
              <Volume2 className="h-8 w-8 mx-auto mb-2" />
              <p>Click one of the options below to start voice-based attendance</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center gap-4 pt-2">
          <Button 
            className="flex-1" 
            onClick={handleCheckIn}
            disabled={isListening || processing}
          >
            <Clock className="mr-2 h-4 w-4" />
            Voice Check In
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleCheckOut}
            disabled={isListening || processing}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Voice Check Out
          </Button>
        </div>
        
        <div className="bg-muted p-3 rounded-md text-sm">
          <p className="font-medium mb-1">Voice Commands:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• "Check in for [your name]"</li>
            <li>• "Check out for [your name]"</li>
            <li>• "Register attendance for [your name]"</li>
            <li>• "Complete my day for [your name]"</li>
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">Multi-language Support</Badge>
          <Badge variant="outline" className="text-xs">Voice Recognition</Badge>
          <Badge variant="outline" className="text-xs">Fraud Detection</Badge>
          <Badge variant="outline" className="text-xs">Contactless</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAttendance;