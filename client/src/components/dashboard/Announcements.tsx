import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Announcement } from "@shared/schema";

const Announcements: React.FC = () => {
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements/recent"],
  });

  // Function to format post date
  const formatPostDate = (date: Date) => {
    const now = new Date();
    const postDate = new Date(date);
    
    // Calculate difference in days
    const diffTime = now.getTime() - postDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Posted today";
    } else if (diffDays === 1) {
      return "Posted yesterday";
    } else if (diffDays < 7) {
      return `Posted ${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Posted ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else {
      return `Posted on ${postDate.toLocaleDateString()}`;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-lg font-medium">Announcements</CardTitle>
        <button className="text-sm text-primary hover:text-primary-dark">
          View all
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-4 text-center">Loading announcements...</div>
          ) : announcements && announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <div 
                key={announcement.id} 
                className={`pb-4 ${index < announcements.length - 1 ? "border-b border-neutral-light" : ""}`}
              >
                <h4 className="text-sm font-medium">{announcement.title}</h4>
                <p className="text-xs text-neutral-medium mt-1">
                  {formatPostDate(announcement.postDate)}
                </p>
                <p className="text-sm mt-2">{announcement.content}</p>
              </div>
            ))
          ) : (
            <div className="py-4 text-center">No announcements found</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Announcements;
