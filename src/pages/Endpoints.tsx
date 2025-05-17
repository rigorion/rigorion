
import { Layout } from "@/components/layout/Layout";
import AllEndpointsFetcher from "@/components/endpoints/AllEndpointsFetcher";
import CorsDiagnosticTool from "@/components/endpoints/CorsDiagnosticTool";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Endpoints() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">API Endpoints Explorer</h1>
        <p className="mb-4 text-gray-600">
          This interactive page allows you to test all available Supabase Edge Function endpoints.
          Click the "Fetch" buttons to send requests and see responses in real-time.
        </p>
        
        <Tabs defaultValue="endpoints" className="w-full mb-8">
          <TabsList>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="diagnostic">CORS Diagnostic</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoints">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How to Use This Explorer</CardTitle>
                <CardDescription>Instructions for using the API explorer</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Click the <strong>Fetch Data</strong> button on any endpoint card to make a request</li>
                  <li>For POST requests, you can edit the JSON payload before sending</li>
                  <li>Switch between GET and POST endpoints using the tabs</li>
                  <li>Use the authentication toggle at the top if you need to include your auth token</li>
                  <li>Response data will appear below each endpoint after fetching</li>
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
