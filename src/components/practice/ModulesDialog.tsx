
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import { useState } from "react";
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full bg-transparent hover:bg-gray-100 transition-colors"
        >
          <BookOpen className="h-4 w-4 mr-1.5 text-blue-500" />
          Modules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-center">Your Purchased Modules</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {modules.map((module) => (
            <motion.div 
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <motion.h3 
                  className="font-medium"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  {module.title}
                </motion.h3>
                <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  {module.completionRate}% Complete
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{module.description}</p>
              
              {/* Progress bar with shine animation */}
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
      </DialogContent>
    </Dialog>
  );
};

export default ModulesDialog;
