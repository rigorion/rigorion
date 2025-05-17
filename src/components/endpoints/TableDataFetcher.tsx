import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, RefreshCw, Database, AlertCircle } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { TABLES, fetchTable, checkTableExists } from "@/services/tableDataService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Interface to define a table structure
interface TableInfo {
  name: string;
  description: string;
  exists?: boolean;
}

const TableDataFetcher = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryTime, setQueryTime] = useState<number | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [isLoadingTables, setIsLoadingTables] = useState<boolean>(true);

  // Fetch available tables from our predefined list
  const fetchAvailableTables = async () => {
    setIsLoadingTables(true);
    setError(null);
    
    try {
      console.log('Fetching available tables...');
      
      // Create formatted table list from our predefined TABLES constant
      const formattedTables: TableInfo[] = [];
      
      // Check which tables actually exist in the database
      for (const tableName of TABLES) {
        const exists = await checkTableExists(tableName);
        
        formattedTables.push({
          name: tableName,
          description: exists ? "Table in public schema" : "Table not created yet",
          exists
        });
      }
      
      console.log('Tables status:', formattedTables);
      setTables(formattedTables);
      
      // If we had a selected table but it's no longer in the list, clear selection
      if (selectedTable && !formattedTables.find(t => t.name === selectedTable)) {
        setSelectedTable("");
      }
      
      const existingTableCount = formattedTables.filter(t => t.exists).length;
      if (existingTableCount === 0) {
        toast({
          title: "No tables exist yet",
          description: "You need to create tables in your Supabase project first",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Tables checked",
          description: `Found ${existingTableCount} existing tables out of ${formattedTables.length} defined tables`,
        });
      }
    } catch (err: any) {
      console.error('Exception fetching tables:', err);
      setError(err.message || 'An error occurred fetching tables.');
      toast({
        title: "Error fetching tables",
        description: err.message || "Make sure your Supabase connection is working correctly.",
        variant: "destructive",
      });
      
      // Fallback to all tables on error
      setTables(TABLES.map(name => ({
        name,
        description: "Status unknown",
      })));
    } finally {
      setIsLoadingTables(false);
    }
  };

  // Load tables when component mounts
  useEffect(() => {
    fetchAvailableTables();
  }, []);

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
      
      // Use our new fetchTable service
      const { data, count } = await fetchTable(selectedTable, { limit });
      const endTime = performance.now();
      setQueryTime(endTime - startTime);

      if (!data || data.length === 0) {
        setData([]);
        setRowCount(0);
        return;
      }

      console.log(`Fetched ${data.length} rows from ${selectedTable}`);
      setData(data);
      setRowCount(count !== null ? count : data.length);
    } catch (err: any) {
      console.error("Exception while fetching table data:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedTableExists = selectedTable ? tables.find(t => t.name === selectedTable)?.exists : false;

  return (
    <div className="space-y-6">
      <Card className="p-4 border border-gray-200">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Select Table and Options</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAvailableTables}
              disabled={isLoadingTables}
              className="flex items-center gap-1"
            >
              <RefreshCw size={14} className={isLoadingTables ? "animate-spin" : ""} />
              <span>Refresh Tables</span>
            </Button>
          </div>
          
          {isLoadingTables ? (
            <div className="py-4 text-center text-gray-500">
              <Database className="animate-pulse inline-block mr-2" size={16} />
              Loading available tables...
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Table:
                </label>
                <Select 
                  value={selectedTable} 
                  onValueChange={(value) => setSelectedTable(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available Tables ({tables.length})</SelectLabel>
                      {tables.map((table) => (
                        <SelectItem 
                          key={table.name} 
                          value={table.name}
                          disabled={table.exists === false}
                        >
                          {table.name} 
                          {table.exists === false && " (Not created yet)"}
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
          )}
        </div>

        {selectedTable && !selectedTableExists && (
          <Alert variant="destructive" className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Table does not exist</AlertTitle>
            <AlertDescription>
              The table "{selectedTable}" hasn't been created in your Supabase database yet.
            </AlertDescription>
          </Alert>
        )}
        
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
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(data[0]).map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}>
                    {Object.entries(row).map(([column, value], cellIndex) => (
                      <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value || '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            <p>This data was fetched directly from the Supabase database using the client library.</p>
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
