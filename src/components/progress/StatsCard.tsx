
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ProjectedScore } from "@/components/stats/ProjectedScore";

interface StatProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  backgroundColor?: string;
  transparent?: boolean;
  fill?: boolean;
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
    backgroundColor = "bg-white",
    fill = false
  } = stat;

  return (
    <Card className="p-4 hover:shadow-sm transition-all duration-300 border border-gray-50 overflow-hidden rounded-xl bg-white">
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${backgroundColor}`}>
          <Icon className={`h-6 w-6 ${color}`} strokeWidth={1.5} />
        </div>
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
      className="grid grid-cols-5 gap-4 max-w-[95%] mx-auto"
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
