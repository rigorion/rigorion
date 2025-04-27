
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TestMockData {
  id: string;
  name: string;
  status: 'completed' | 'incomplete' | 'in-progress' | 'unattempted';
  score?: number;
}

const defaultTests: TestMockData[] = [
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

  useEffect(() => {
    // If tests were passed as props, use those instead of fetching
    if (propTests && propTests.length > 0) {
      setTests(propTests);
      setLoading(false);
      return;
    }
    
    const fetchTests = async () => {
      try {
        console.log('⭐ Attempting to fetch mock tests from endpoint...');
        
        // Use the environment variable for the Supabase URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const url = `${supabaseUrl}/functions/v1/mock`;
        
        console.log('⭐ Fetch URL:', url);
        
        // Add timeout to ensure the request doesn't hang
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          credentials: 'omit' // Explicitly avoid sending credentials
        });
        
        clearTimeout(timeoutId);
        
        console.log('⭐ Response status:', response.status);
        console.log('⭐ Response headers:', Object.fromEntries([...response.headers.entries()]));
        
        if (!response.ok) {
          console.error('Response not OK:', response.status, response.statusText);
          const responseText = await response.text();
          console.error('Error response body:', responseText);
          throw new Error(`Failed to fetch mock tests: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('⭐ Mock tests data received:', data);
        
        if (Array.isArray(data)) {
          setTests(data);
        } else {
          console.error('Received non-array data:', data);
          throw new Error('Received invalid data format');
        }
      } catch (err) {
        console.error('⭐ Error fetching tests:', err);
        setError('Failed to load test data');
        setTests(defaultTests);
        toast.error("Could not load mock tests. Using sample data.");
      } finally {
        setLoading(false);
      }
    };

    console.log('⭐ Starting fetch tests effect...');
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
  const fullTestList = tests.length > 0 ? [...tests.slice(0, 100)] : [...defaultTests];
  while (fullTestList.length < 10) { // Reduced to 10 entries for better performance
    fullTestList.push({
      id: `empty-${fullTestList.length}`,
      name: `Mock Test ${fullTestList.length + 1}`,
      status: 'unattempted'
    });
  }

  if (loading) {
    return <div className="h-[480px] flex items-center justify-center">Loading mock tests...</div>;
  }

  if (error) {
    return <div className="h-[480px] flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100 h-[480px]">
      <h3 className="text-lg font-semibold mb-4">Mock Exams</h3>
      <div className="overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
        <Table>
          <TableHeader className="sticky top-0 bg-white shadow-sm z-10">
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
