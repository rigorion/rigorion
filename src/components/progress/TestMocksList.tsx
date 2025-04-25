
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, Clock, X } from "lucide-react";

interface TestMockData {
  id: string;
  name: string;
  status: 'completed' | 'incomplete' | 'in-progress';
  score?: number;
  date?: string;
}

interface TestMocksListProps {
  tests: ReadonlyArray<TestMockData>;
}

export const TestMocksList = ({ tests }: TestMocksListProps) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': 
        return <Check className="h-4 w-4 text-green-500" />;
      case 'incomplete': 
        return <X className="h-4 w-4 text-red-500" />;
      case 'in-progress': 
        return <Clock className="h-4 w-4 text-orange-500" />;
      default: 
        return null;
    }
  };

  const getStatusText = (status: string, score?: number) => {
    switch(status) {
      case 'completed': 
        return <span className="text-sm font-medium text-green-500">Score: {score}%</span>;
      case 'incomplete': 
        return <span className="text-sm text-red-500">Incomplete</span>;
      case 'in-progress': 
        return <span className="text-sm text-orange-500">In Progress</span>;
      default: 
        return null;
    }
  };

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-lg font-semibold mb-6 text-center text-gray-800">Mock Exams</h3>
      <div className="grid grid-cols-1 gap-3">
        {tests.map((test, index) => (
          <motion.div 
            key={test.id} 
            className="p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gray-50 p-1 rounded-md">
                  {getStatusIcon(test.status)}
                </div>
                <span className="font-medium text-gray-800">{test.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusText(test.status, test.score)}
                {test.date && <span className="text-xs text-gray-500">{test.date}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">10 total mock exams available</span>
      </div>
    </Card>
  );
};
