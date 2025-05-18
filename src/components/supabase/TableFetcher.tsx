
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface TableFetcherProps {
  defaultTable?: string;
}

const TableFetcher = ({ defaultTable = "community_stats" }: TableFetcherProps) => {
  const [tableName, setTableName] = useState(defaultTable);
  const [columns, setColumns] = useState("*");
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching data from ${tableName} with columns: ${columns}`);
      
      // Use the generic query method to avoid TypeScript errors with dynamic table names
      const { data, error } = await supabase
        .from(tableName)
        .select(columns)
        .limit(10) as any;
      
      if (error) throw error;
      
      console.log("Fetched data:", data);
      setResults(data);
      
      toast({
        title: "Data fetched successfully",
        description: `Retrieved ${data?.length || 0} rows from ${tableName}`,
      });
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An unknown error occurred");
      
      toast({
        title: "Error fetching data",
        description: err.message || "Failed to fetch data from the table",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Supabase Table Fetcher</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="table-name" className="text-sm font-medium">
              Table Name:
            </label>
            <Input 
              id="table-name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="columns" className="text-sm font-medium">
              Columns (comma separated, or * for all):
            </label>
            <Input 
              id="columns"
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              placeholder="*, column1, column2, related_table(column)"
            />
          </div>
          
          <Button 
            onClick={fetchData} 
            disabled={loading || !tableName}
            className="w-full"
          >
            {loading ? "Fetching..." : "Fetch Data"}
          </Button>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600">
              Error: {error}
            </div>
          )}
          
          {results && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Results ({results.length} rows):</h3>
              {results.length > 0 ? (
                <div className="border rounded overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(results[0]).map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((row, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                          {Object.entries(row).map(([column, value], cellIndex) => (
                            <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                              {typeof value === 'object' && value !== null ? (
                                <pre className="text-xs overflow-auto max-w-xs whitespace-pre-wrap">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                String(value ?? '')
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No data found.</p>
              )}
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-2">
            <p>💡 Tips:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Use <code>*</code> to select all columns</li>
              <li>For related tables: <code>related_table(id, name)</code></li>
              <li>For JSON columns: <code>json_column-&gt;key</code></li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableFetcher;
