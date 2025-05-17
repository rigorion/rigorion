
import { Layout } from "@/components/layout/Layout";
import AllEndpointsFetcher from "@/components/endpoints/AllEndpointsFetcher";
import CorsDiagnosticTool from "@/components/endpoints/CorsDiagnosticTool";
import TableDataFetcher from "@/components/endpoints/TableDataFetcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Endpoints() {
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
        </Tabs>
      </div>
    </Layout>
  );
}
