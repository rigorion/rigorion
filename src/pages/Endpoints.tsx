
import { Layout } from "@/components/layout/Layout";
import AllEndpointsFetcher from "@/components/endpoints/AllEndpointsFetcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Endpoints() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">API Endpoints Explorer</h1>
        <p className="mb-4 text-gray-600">
          This page allows you to explore and test all available Supabase Edge Function endpoints.
          Each endpoint will display its response data, loading state, and any errors that occur.
        </p>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About These Endpoints</CardTitle>
            <CardDescription>Important information about the API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>All endpoints are public by default and don't require authentication</li>
              <li>Use the toggle to include your auth token if needed for protected endpoints</li>
              <li>Response times may vary based on function cold starts</li>
              <li>These endpoints are designed for demonstration purposes</li>
            </ul>
          </CardContent>
        </Card>
        
        <AllEndpointsFetcher />
      </div>
    </Layout>
  );
}
