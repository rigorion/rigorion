
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { TABLES, fetchAllTables } from "@/services/tableDataService";

const FetchAllTablesButton = () => {
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  
  const handleFetchAllData = async () => {
    setIsFetchingAll(true);
    try {
      toast({
        title: "Fetching all tables",
        description: `Starting to fetch data from ${TABLES.length} tables...`
      });
      
      const results = await fetchAllTables({ limit: 50 });
      const tableCount = Object.keys(results).length;
      const dataCount = Object.values(results).reduce((acc, tableData) => 
        acc + (Array.isArray(tableData) ? tableData.length : 0), 0);
      
      console.log("All tables data:", results);
      
      toast({
        title: "Fetch Completed",
        description: `Retrieved ${dataCount} rows from ${tableCount} tables`
      });
    } catch (error) {
      console.error("Error fetching all tables:", error);
      toast({
        title: "Error",
        description: "Failed to fetch all tables. See console for details.",
        variant: "destructive"
      });
    } finally {
      setIsFetchingAll(false);
    }
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-3">
        Available tables: {TABLES.join(', ')}
      </p>
      <Button 
        onClick={handleFetchAllData} 
        disabled={isFetchingAll}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isFetchingAll ? "Fetching All Tables..." : "Fetch All Tables"}
      </Button>
      <p className="text-xs text-gray-500 mt-1">
        This will fetch data from all tables and log it to the console
      </p>
    </div>
  );
};

export default FetchAllTablesButton;
