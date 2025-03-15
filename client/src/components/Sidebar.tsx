import React from "react";
import { Link, useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3Icon, 
  Users, 
  CreditCard, 
  BriefcaseIcon, 
  LineChartIcon, 
  ClockIcon,
  ScrollIcon,
  BarChart4Icon,
  Settings
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, children, active }) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-2 text-sm font-medium rounded-md",
          active
            ? "bg-primary-light text-white"
            : "text-neutral-dark hover:bg-neutral-lightest hover:text-primary transition"
        )}
      >
        <span className="mr-3 text-lg">{icon}</span>
        {children}
      </a>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const [location] = useLocation();
  const { isMobile } = useMobile();
  
  if (!open) {
    return null;
  }

  const sidebarClasses = cn(
    "flex flex-col w-64 bg-white shadow-lg",
    isMobile && "fixed inset-0 z-40"
  );

  return (
    <div className={isMobile ? "fixed inset-0 z-40" : "hidden md:flex md:flex-shrink-0"}>
      <div className={sidebarClasses}>
        {isMobile && (
          <div className="absolute top-0 right-0 p-4">
            <button
              onClick={onClose}
              className="text-neutral-dark hover:text-neutral-darkest"
            >
              &times;
            </button>
          </div>
        )}
        
        <div className="flex items-center justify-center h-16 px-4 bg-primary text-white">
          <span className="text-xl font-semibold">HR System</span>
        </div>
        
        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <SidebarLink href="/" icon={<BarChart3Icon />} active={location === "/"}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/employees" icon={<Users />} active={location === "/employees"}>
              Employees
            </SidebarLink>
            <SidebarLink href="/payroll" icon={<CreditCard />} active={location === "/payroll"}>
              Payroll
            </SidebarLink>
            <SidebarLink href="/recruitment" icon={<BriefcaseIcon />} active={location === "/recruitment"}>
              Recruitment
            </SidebarLink>
            <SidebarLink href="/performance" icon={<LineChartIcon />} active={location === "/performance"}>
              Performance
            </SidebarLink>
            <SidebarLink href="/attendance" icon={<ClockIcon />} active={location === "/attendance"}>
              Attendance
            </SidebarLink>
            <SidebarLink href="#" icon={<ScrollIcon />} active={location === "/compliance"}>
              Compliance
            </SidebarLink>
            <SidebarLink href="#" icon={<BarChart4Icon />} active={location === "/reports"}>
              Reports
            </SidebarLink>
            <SidebarLink href="/settings" icon={<Settings />} active={location === "/settings"}>
              Settings
            </SidebarLink>
          </nav>
        </div>
        
        <div className="p-4 border-t border-neutral-light">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>HR</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-dark">Tom Cook</p>
              <p className="text-xs text-neutral-medium">HR Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
