
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ProjectedScore } from "@/components/stats/ProjectedScore";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";

interface StatProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  backgroundColor?: string;
  transparent?: boolean;
  fill?: boolean;
  onSelect?: (date: Date) => void;
  isCalendar?: boolean;
  selectedDate?: Date | null;
}

interface StatsCardProps {
  stat: StatProps | {
    component: React.ComponentType;
  };
  index: number;
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const StatsCard = ({
  stat,
  index
}: StatsCardProps) => {
  if ('component' in stat) {
    const Component = stat.component;
    return <Component />;
  }

  const {
    title,
    value,
    icon: Icon,
    color,
    isCalendar,
    onSelect,
    selectedDate
  } = stat;

  if (isCalendar) {
    return (
      <Card className="p-4 transition-all duration-300 border-none shadow-none">
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-between rounded-full text-base font-normal p-0 hover:bg-transparent">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-500" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm text-gray-500 text-left">{title}</p>
                    <p className="text-lg font-semibold text-left">{value}</p>
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border bg-white shadow-lg" align="start">
              <DatePicker 
                mode="single" 
                selected={selectedDate} 
                onSelect={onSelect}
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 transition-all duration-300 border-none shadow-none">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-blue-500" strokeWidth={1.5} />
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export const StatsCardGrid = ({
  stats
}: {
  stats: Array<StatProps | { component: React.ComponentType; }>;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[95%] mx-auto"
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          className="w-full"
        >
          <StatsCard stat={stat} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
};
