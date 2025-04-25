
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TestMockData {
  id: string;
  name: string;
  status: 'completed' | 'incomplete' | 'in-progress' | 'unattempted';
  score?: number;
}

interface TestMocksListProps {
  tests: ReadonlyArray<TestMockData>;
}

export const TestMocksList = ({ tests }: TestMocksListProps) => {
  const getStatusStyles = (status: string, score?: number) => {
    if (status === 'completed' && score) {
      return 'text-green-600 font-medium';
    }
    switch(status) {
      case 'in-progress': 
        return 'text-orange-500';
      case 'incomplete': 
        return 'text-red-500';
      case 'unattempted': 
        return 'text-gray-400';
      default: 
        return '';
    }
  };

  const getStatusText = (status: string, score?: number) => {
    if (status === 'completed' && score) {
      return `Score: ${score}%`;
    }
    switch(status) {
      case 'in-progress': 
        return 'In Progress';
      case 'incomplete': 
        return 'Incomplete';
      case 'unattempted': 
        return 'Not Attempted';
      default: 
        return status;
    }
  };

  // Ensure we always show 10 rows by padding with unattempted tests
  const fullTestList = [...tests];
  while (fullTestList.length < 10) {
    fullTestList.push({
      id: `empty-${fullTestList.length}`,
      name: `Mock Test ${fullTestList.length + 1}`,
      status: 'unattempted'
    });
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Mock Exams</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fullTestList.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.name}</TableCell>
              <TableCell className={cn(getStatusStyles(test.status, test.score))}>
                {getStatusText(test.status, test.score)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
