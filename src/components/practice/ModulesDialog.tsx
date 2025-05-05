
import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
          Modules
          <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 max-h-[400px] bg-white border border-gray-200 shadow-lg rounded-lg p-2"
      >
        <ScrollArea className="h-[350px] pr-3">
          <div className="space-y-3">
            {modules.map((module) => (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border rounded-lg p-3 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">{module.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                    {module.completionRate}% Complete
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    style={{ width: `${module.completionRate}%` }}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
                
                <div className="flex justify-end mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModulesDialog;
