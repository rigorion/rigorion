
import { Layout } from "@/components/layout/Layout";
import AllEndpointsFetcher from "@/components/endpoints/AllEndpointsFetcher";

export default function Endpoints() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">API Endpoints Explorer</h1>
        <p className="mb-8 text-gray-600">
          This page allows you to explore and test all available Supabase Edge Function endpoints.
          Each endpoint will display its response data, loading state, and any errors that occur.
        </p>
        <AllEndpointsFetcher />
      </div>
    </Layout>
  );
}
