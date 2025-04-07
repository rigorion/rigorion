import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard = ({ title, children, className }: DashboardCardProps) => {
  return (
    <Card className={cn(
      "p-6 bg-card hover:bg-card-hover transition-all duration-300 animate-fade-up backdrop-blur-sm",
      className
    )}>
      <h3 className="text-lg font-semibold mb-4 text-primary-dark">{title}</h3>
      {children}
    </Card>
  );
};