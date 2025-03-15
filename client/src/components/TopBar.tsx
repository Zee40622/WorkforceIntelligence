import React from "react";
import { BellIcon, HelpCircleIcon, MenuIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const [location] = useLocation();

  // Function to get page title based on current location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/employees":
        return "Employees";
      case "/payroll":
        return "Payroll";
      case "/recruitment":
        return "Recruitment";
      case "/performance":
        return "Performance";
      case "/attendance":
        return "Attendance";
      case "/settings":
        return "Settings";
      default:
        return "HR System";
    }
  };

  return (
    <div className="relative z-10 flex h-16 bg-white shadow">
      <button 
        className="px-4 text-neutral-dark md:hidden"
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-neutral-dark">{getPageTitle()}</h1>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          <button className="p-1 rounded-full text-neutral-medium hover:text-neutral-dark">
            <BellIcon className="h-6 w-6" />
          </button>
          
          <button className="p-1 rounded-full text-neutral-medium hover:text-neutral-dark ml-3">
            <HelpCircleIcon className="h-6 w-6" />
          </button>
          
          <div className="ml-3 relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>HR</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
