
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const supabase = createClient('https://eantvimmgdmxzwrjwrop.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhbnR2aW1tZ2RteHp3cmp3cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MTA5MjQsImV4cCI6MjA2MTE4NjkyNH0.ba6UMchrXuMqmkWXzoC2Dd91y-HJm_cB1NMmwNRly-k')
const { data, error } = await supabase.functions.invoke('get-user-progress', {
  body: { name: 'Functions' },
})
console.log('We did it: ', data)

interface TestMockData {
  id: string;
  name: string;
  status: 'completed' | 'incomplete' | 'in-progress' | 'unattempted';
  score?: number;
}

const defaultTests: TestMockData[] = [
  // Add your default dummy data here
  {
    id: '1',
    name: 'Mock Test 1',
    status: 'completed',
    score: 85
  },
  {
    id: '2',
    name: 'Mock Test 2',
    status: 'in-progress'
  },
  // Add more dummy entries as needed
];

export const TestMocksList = ({ tests: propTests }: { tests?: TestMockData[] }) => {
  const [tests, setTests] = useState<TestMockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
console.log('We did it: ', data)
  useEffect(() => {
    // If tests were passed as props, use those instead of fetching
    if (propTests && propTests.length > 0) {
      setTests(propTests);
      setLoading(false);
      return;
    }
    
    const fetchTests = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-user-progress', {
          body: { name: 'Functions' },
        });

        if (error) throw error;
        setTests(data || []);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError('Failed to load test data');
        setTests(defaultTests);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [propTests]);

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

  // Combine fetched tests with fallback data and limit to 100 entries
  const fullTestList = [...tests.slice(0, 100)];
  while (fullTestList.length < 100) {
    fullTestList.push({
      id: `empty-${fullTestList.length}`,
      name: `Mock Test ${fullTestList.length + 1}`,
      status: 'unattempted'
    });
  }

  if (loading) {
    return <div>Loading mock tests...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Mock Exams</h3>
      <div className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white shadow-sm">
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
    </div>
  );
};
