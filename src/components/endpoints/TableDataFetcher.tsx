
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle } from "lucide-react";

// List of available public tables for direct querying
const AVAILABLE_TABLES = [
  { name: "questions", description: "SAT math questions" },
  { name: "profiles", description: "User profiles" },
  { name: "payments", description: "User payments" }
];

const TableDataFetcher = () => {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryTime, setQueryTime] = useState<number | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);

  const fetchTableData = async () => {
    if (!selectedTable) {
      setError("Please select a table first");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setQueryTime(null);
    setRowCount(null);

    const startTime = performance.now();
    
    try {
      console.log(`Fetching data from ${selectedTable} table with limit ${limit}`);
      
      // Query the selected table with a limit
      const { data, error, count } = await supabase
        .from(selectedTable)
        .select('*', { count: 'exact' })
        .limit(limit);
        
      const endTime = performance.now();
      setQueryTime(endTime - startTime);

      if (error) {
        console.error("Error fetching table data:", error);
        setError(error.message);
        return;
      }

      console.log(`Fetched ${data.length} rows from ${selectedTable}`);
      setData(data);
      setRowCount(count);
    } catch (err: any) {
      console.error("Exception while fetching table data:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Select Table and Options</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-1">
                Table:
              </label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Tables</SelectLabel>
                    {AVAILABLE_TABLES.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name} - {table.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-24">
              <label htmlFor="limit-input" className="block text-sm font-medium text-gray-700 mb-1">
                Limit:
              </label>
              <Input
                id="limit-input"
                type="number"
                min="1"
                max="100"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <Button
          onClick={fetchTableData}
          disabled={loading || !selectedTable}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Fetching..." : "Fetch Table Data"}
        </Button>
        
        {queryTime !== null && data && (
          <div className="mt-2 text-sm text-gray-500">
            Query completed in {queryTime.toFixed(2)}ms
          </div>
        )}
      </Card>

      {/* Loading state */}
      {loading && <div className="text-blue-600">🔄 Loading data from {selectedTable}...</div>}

      {/* Error state */}
      {error && (
        <div className="text-red-500 p-4 bg-red-50 border border-red-100 rounded">
          <div className="flex items-center">
            <AlertTriangle size={16} className="mr-1" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {data && data.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <CheckCircle size={16} className="text-green-500 mr-2" />
            <h3 className="text-lg font-medium">
              Results ({rowCount !== null ? `${data.length} of ${rowCount} rows` : `${data.length} rows`})
            </h3>
          </div>
          
          <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-[500px] overflow-auto">
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            <p>This data was fetched directly from the Supabase database using the client library, avoiding CORS issues that can occur with Edge Functions.</p>
          </div>
        </div>
      )}
      
      {data && data.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
          <p>No data found in the {selectedTable} table.</p>
        </div>
      )}
    </div>
  );
};

export default TableDataFetcher;
