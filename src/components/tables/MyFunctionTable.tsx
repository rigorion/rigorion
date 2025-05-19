
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MyFunctionTable() {
  const [data, setData] = useState<any>(null);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      
      try {
        const response = await fetch('https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/my-function', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        
        // Dynamically determine column names from the first item if it's an array
        if (Array.isArray(result) && result.length > 0) {
          setColumnNames(Object.keys(result[0]));
        } 
        // If it's a single object, use its keys as column names
        else if (result && typeof result === 'object') {
          setColumnNames(Object.keys(result));
        }
      } catch (err: any) {
        console.error("Error fetching from my-function:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Function to render a data cell based on its value
  const renderCell = (value: any) => {
    if (value === null || value === undefined) {
      return "";
    } else if (typeof value === "object") {
      return (
        <pre className="text-xs overflow-auto whitespace-pre-wrap m-0">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    } else {
      return String(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>📊 My Function Data</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center py-4">Loading data...</p>}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600">
            ❌ Error: {error}
          </div>
        )}
        
        {!loading && !error && !data && (
          <p className="text-center py-4 text-gray-500">No data found.</p>
        )}
        
        {!loading && !error && data && columnNames.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnNames.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(data) ? (
                  // Handle array of objects
                  data.map((row, i) => (
                    <TableRow key={i}>
                      {columnNames.map((col) => (
                        <TableCell key={col} className="max-w-[220px] overflow-auto">
                          {renderCell(row[col])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  // Handle a single object
                  <TableRow>
                    {columnNames.map((col) => (
                      <TableCell key={col} className="max-w-[220px] overflow-auto">
                        {renderCell(data[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
