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
  return <Card className="p-4 hover:shadow-xl transition-all duration-300 border-0 overflow-hidden rounded-xl">
      <div className="flex items-center gap-3">
        <motion.div className={`${color} ${shadowColor} p-2 rounded-lg`} whileHover={{
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
          <Icon className={`h-6 w-6 text-white ${fill ? 'fill-white' : ''}`} strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
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
  }} className="grid grid-cols-5 gap-6">
      {stats.map((stat, index) => <motion.div key={index} variants={itemVariants} className="w-full">
          <StatsCard stat={stat} index={index} />
        </motion.div>)}
    </motion.div>;
};