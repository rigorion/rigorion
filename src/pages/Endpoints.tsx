
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import AllEndpointsFetcher from "@/components/endpoints/AllEndpointsFetcher";
import CorsDiagnosticTool from "@/components/endpoints/CorsDiagnosticTool";
import TableDataFetcher from "@/components/endpoints/TableDataFetcher";
import TableFetcher from "@/components/supabase/TableFetcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABLES, fetchAllTables } from "@/services/tableDataService";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function Endpoints() {
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  
  // Function to fetch data from all tables
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
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">API & Database Explorer</h1>
        <p className="mb-4 text-gray-600">
          This interactive page allows you to test both direct Supabase table access and Edge Function endpoints.
          Compare the different approaches to see which works best for your needs.
        </p>
        
        <Tabs defaultValue="explorer" className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="explorer">Data Explorer</TabsTrigger>
            <TabsTrigger value="diagnostic">CORS Diagnostic</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="simple">Simple Fetcher</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explorer">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How to Use This Explorer</CardTitle>
                <CardDescription>Compare direct table access vs Edge Functions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Direct Table Access</strong>: Uses the Supabase client to query tables directly from the browser (avoids CORS issues)</li>
                  <li><strong>Edge Functions</strong>: Makes HTTP requests to serverless functions (may encounter CORS issues)</li>
                  <li>Switch between tabs to compare different data access methods</li>
                  <li>Use the authentication toggle if accessing protected resources</li>
                  <li>For POST requests, you can edit the JSON payload before sending</li>
                  <li>Response data will appear below each endpoint after fetching</li>
                  <li>The CORS Pong Test endpoint can be used to verify CORS configuration</li>
                </ul>
              </CardContent>
            </Card>
            
            <AllEndpointsFetcher />
          </TabsContent>
          
          <TabsContent value="diagnostic">
            <Card>
              <CardHeader>
                <CardTitle>CORS Diagnostic Tool</CardTitle>
                <CardDescription>Test for CORS issues with Supabase Edge Functions</CardDescription>
              </CardHeader>
              <CardContent>
                <CorsDiagnosticTool />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Table Data Explorer</CardTitle>
                <CardDescription>Directly query Supabase tables</CardDescription>
              </CardHeader>
              <CardContent>
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
                
                <TableDataFetcher />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simple">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Simple Table Fetcher</CardTitle>
                <CardDescription>A simplified interface for querying Supabase tables</CardDescription>
              </CardHeader>
              <CardContent>
                <TableFetcher defaultTable="community_stats" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
