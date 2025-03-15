import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { 
  CalendarIcon, 
  BriefcaseIcon, 
  CakeIcon, 
  UsersIcon,
  GraduationCapIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UpcomingEvents: React.FC = () => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  // Function to get icon based on event title
  const getEventIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("meeting") || lowerTitle.includes("conference")) {
      return <CalendarIcon className="text-primary" />;
    } else if (lowerTitle.includes("interview") || lowerTitle.includes("hiring")) {
      return <BriefcaseIcon className="text-secondary" />;
    } else if (lowerTitle.includes("birthday") || lowerTitle.includes("anniversary")) {
      return <CakeIcon className="text-info" />;
    } else if (lowerTitle.includes("training") || lowerTitle.includes("workshop")) {
      return <GraduationCapIcon className="text-success" />;
    } else {
      return <UsersIcon className="text-primary" />;
    }
  };

  // Function to get border color based on event title
  const getBorderColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("meeting") || lowerTitle.includes("conference")) {
      return "border-primary";
    } else if (lowerTitle.includes("interview") || lowerTitle.includes("hiring")) {
      return "border-secondary";
    } else if (lowerTitle.includes("birthday") || lowerTitle.includes("anniversary")) {
      return "border-info";
    } else if (lowerTitle.includes("training") || lowerTitle.includes("workshop")) {
      return "border-success";
    } else {
      return "border-primary";
    }
  };

  // Function to format date and time
  const formatDateTime = (start: Date, end: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const formattedDate = startDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    if (isSameDay) {
      const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (
        startDate.getHours() === 0 && startDate.getMinutes() === 0 &&
        endDate.getHours() === 23 && endDate.getMinutes() === 59
      ) {
        return `${formattedDate}, All Day`;
      }
      
      return `${formattedDate}, ${startTime} - ${endTime}`;
    } else {
      const endFormattedDate = endDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `${formattedDate} - ${endFormattedDate}`;
    }
  };

  // Function to get icon background color
  const getIconBgColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes("meeting") || lowerTitle.includes("conference")) {
      return "bg-primary-light bg-opacity-10";
    } else if (lowerTitle.includes("interview") || lowerTitle.includes("hiring")) {
      return "bg-secondary-light bg-opacity-10";
    } else if (lowerTitle.includes("birthday") || lowerTitle.includes("anniversary")) {
      return "bg-info bg-opacity-10";
    } else if (lowerTitle.includes("training") || lowerTitle.includes("workshop")) {
      return "bg-success bg-opacity-10";
    } else {
      return "bg-primary-light bg-opacity-10";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
        <button className="text-sm text-primary hover:text-primary-dark">
          View all
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-4 text-center">Loading upcoming events...</div>
          ) : events && events.length > 0 ? (
            events.map((event) => (
              <div 
                key={event.id} 
                className={`flex border-l-4 pl-4 ${getBorderColor(event.title)}`}
              >
                <div className="mr-4 flex-shrink-0">
                  <span className={`flex h-12 w-12 rounded-md items-center justify-center ${getIconBgColor(event.title)}`}>
                    {getEventIcon(event.title)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium">{event.title}</h4>
                  <p className="text-xs text-neutral-medium mt-1">
                    {formatDateTime(event.startDate, event.endDate)}
                  </p>
                  {event.location && (
                    <p className="text-xs text-neutral-medium mt-1">
                      {event.location}
                    </p>
                  )}
                  <div className="mt-2 flex items-center">
                    <div className="flex -space-x-1">
                      <Avatar className="h-5 w-5 border border-white">
                        <AvatarFallback className="text-[8px]">U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-5 w-5 border border-white">
                        <AvatarFallback className="text-[8px]">U2</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-5 w-5 border border-white">
                        <AvatarFallback className="text-[8px]">U3</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-xs text-neutral-medium ml-2">+5 more</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center">No upcoming events found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
