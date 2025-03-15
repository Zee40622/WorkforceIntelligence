import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  change?: number;
  changeText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  change = 0,
  changeText = "vs last month"
}) => {
  // Determine color based on change value
  const getChangeColor = () => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-error";
    return "text-warning";
  };

  // Determine icon based on change value
  const getChangeIcon = () => {
    if (change > 0) return <ArrowUpIcon className="text-xs mr-1" />;
    if (change < 0) return <ArrowDownIcon className="text-xs mr-1" />;
    return <MinusIcon className="text-xs mr-1" />;
  };

  const changeValue = Math.abs(change).toFixed(1) + "%";

  return (
    <Card className="p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-neutral-medium text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className={cn("rounded-full p-2", `bg-opacity-10 ${iconBgColor}`)}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span className={cn("flex items-center", getChangeColor())}>
          {getChangeIcon()}
          {changeValue}
        </span>
        <span className="text-neutral-medium ml-2">{changeText}</span>
      </div>
    </Card>
  );
};

export default StatCard;
