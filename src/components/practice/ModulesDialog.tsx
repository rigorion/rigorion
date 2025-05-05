
import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface Module {
  id: number;
  title: string;
  description: string;
  purchased: boolean;
  completionRate: number;
}

const ModulesDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data for purchased modules
  const [modules] = useState<Module[]>([
    {
      id: 1,
      title: "Algebra Fundamentals",
      description: "Master basic algebraic equations and expressions",
      purchased: true,
      completionRate: 75
    },
    {
      id: 2,
      title: "Geometry Essentials",
      description: "Learn about shapes, angles, and spatial relationships",
      purchased: true,
      completionRate: 40
    },
    {
      id: 3,
      title: "Calculus I",
      description: "Introduction to derivatives and integrals",
      purchased: true,
      completionRate: 20
    },
    {
      id: 4,
      title: "Statistics Foundations",
      description: "Understand probability and statistical analysis",
      purchased: true,
      completionRate: 10
    }
  ]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
        >
          <BookOpen className="h-4 w-4 mr-1.5 text-blue-500" />
          Exams
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 max-h-[400px] bg-white border border-gray-200 shadow-lg rounded-lg p-2"
      >
        <ScrollArea className="h-[350px] pr-3">
          <div className="space-y-2">
            {modules.map((module) => (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-between"
              >
                <span className="font-source-sans text-[#304455] text-sm font-medium">{module.title}</span>
                <span className="text-xs bg-[#F2FCE2] text-[#166534] py-1 px-2 rounded-full">
                  {module.completionRate}%
                </span>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModulesDialog;
