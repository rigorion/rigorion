import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ProjectedScore } from "@/components/stats/ProjectedScore";
interface StatProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  shadowColor: string;
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
    shadowColor,
    fill = false
  } = stat;
  return <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group rounded-none bg-white">
      <div className="flex items-center gap-3">
        <motion.div className={`p-2.5 rounded-full ${color} ${shadowColor} shadow-lg`} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} initial={{
        rotate: 0
      }} animate={{
        rotate: 360
      }} transition={{
        duration: 0.5,
        ease: "easeInOut",
        repeat: 0
      }}>
          <Icon className={`h-5 w-5 text-white ${fill ? 'fill-white' : ''}`} strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>;
};
export const StatsCardGrid = ({
  stats
}: {
  stats: Array<StatProps | {
    component: React.ComponentType;
  }>;
}) => {
  return <motion.div initial="hidden" animate="visible" variants={{
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 bg-inherit">
      {stats.map((stat, index) => <motion.div key={index} variants={itemVariants}>
          <StatsCard stat={stat} index={index} />
        </motion.div>)}
    </motion.div>;
};