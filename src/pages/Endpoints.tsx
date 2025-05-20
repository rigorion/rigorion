
import { Layout } from "@/components/layout/Layout";
import EndpointsTabs from "@/components/endpoints/EndpointsTabs";

export default function Endpoints() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">API & Database Explorer</h1>
        <p className="mb-4 text-gray-600">
          This interactive page allows you to test both direct Supabase table access and Edge Function endpoints.
          Compare the different approaches to see which works best for your needs.
        </p>
        
        <EndpointsTabs />
      </div>
    </Layout>
  );
}
