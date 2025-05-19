
import { useState, useEffect } from "react";
import UniversalFetcher from "./UniversalFetcher";
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDataFetcher from "./TableDataFetcher";

interface Endpoint {
  url: string;
  title: string;
  method: "GET" | "POST";
  payload?: any;
}

const AllEndpointsFetcher = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [postEndpoints, setPostEndpoints] = useState<Endpoint[]>([]);
  const [authHeaders, setAuthHeaders] = useState<Record<string, string>>({});
  const [useAuth, setUseAuth] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Define base GET endpoints
    const baseEndpoints: Endpoint[] = [
      {
        url: `${SUPABASE_URL}/functions/v1/log-interaction`,
        title: "user_question_interactions (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/get-sat-math-questions`,
        title: "model_test_question (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/get-user-progress`,
        title: "sat_math_progress (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/get-apijson`,
        title: "sat_math_leaders_board (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/my-function`,
        title: "model_sat_math_question (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/encrypted-data`,
        title: "encrypted-data (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/mock`,
        title: "mock tests (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/get-leaderboard`,
        title: "leaderboard (GET)",
        method: "GET"
      },
      {
        url: `${SUPABASE_URL}/functions/v1/get-performance`,
        title: "performance (GET)",
        method: "GET"
      },
      {
        url: "https://mmxqzcztduhtrlptzsrp.supabase.co/functions/v1/cors-pong-function",
        title: "CORS Pong Test (GET)",
        method: "GET"
      }
    ];

    // Define POST endpoints
    const postEndpointsList: Endpoint[] = [
      {
        url: `${SUPABASE_URL}/functions/v1/log-interaction`,
        title: "Log Interaction (POST)",
        method: "POST",
        payload: {
          question_id: 123,
          user_id: "user-123",
          interaction_type: "answer",
          interaction_data: {
            selected_option: "A",
            time_spent: 45
          }
        }
      },
      {
        url: `${SUPABASE_URL}/functions/v1/update-user-progress`,
        title: "Update User Progress (POST)",
        method: "POST",
        payload: {
          user_id: "user-123",
          test_id: 456,
          completed: true,
          score: 85
        }
      }
    ];

    // Set the endpoints
    setEndpoints(baseEndpoints);
    setPostEndpoints(postEndpointsList);

    // Get authentication token if user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setAuthHeaders({
          Authorization: `Bearer ${data.session.access_token}`
        });
        setIsAuthenticated(true);
        console.log("User is authenticated, token available if needed");
      } else {
        console.log("User is not authenticated");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const toggleAuth = () => {
    setUseAuth(!useAuth);
  };

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold mb-2">🧑‍💻 Supabase Data Access Explorer</h1>
      <p className="mb-8">Explore both Edge Functions and direct table access methods to understand how data can be fetched. 🚀</p>
      
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-medium">
          Auth Status: {isAuthenticated ? "✅ Token Available" : "❌ No Auth Token"}
        </p>
        <div className="flex items-center mt-2">
          <p className="text-sm text-gray-600 mr-3">
            {useAuth 
              ? "Including auth token with requests" 
              : "Making requests without authentication"}
          </p>
          <Button 
            onClick={toggleAuth} 
            variant="outline" 
            size="sm" 
            className="text-xs"
            disabled={!isAuthenticated}
          >
            {useAuth ? "Disable Auth" : "Enable Auth"}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: Table access requires authentication for restricted tables, but public tables can be accessed without auth
        </p>
      </div>
      
      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tables">Direct Table Access</TabsTrigger>
          <TabsTrigger value="get">GET Edge Functions</TabsTrigger>
          <TabsTrigger value="post">POST Edge Functions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
          <h2 className="text-xl font-semibold mb-4">Direct Table Access</h2>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm">
              This method uses the Supabase client to directly query tables, bypassing Edge Functions and avoiding CORS issues.
              The client handles authentication and CORS automatically.
            </p>
          </div>
          <TableDataFetcher />
        </TabsContent>

        <TabsContent value="get">
          <h2 className="text-xl font-semibold mb-4">GET Edge Functions</h2>
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm">
              Edge Functions may have CORS issues when accessed directly. Compare with table access to see the difference.
            </p>
          </div>
          {endpoints.map((ep) => (
            <UniversalFetcher
              key={ep.url + ep.method}
              url={ep.url}
              method={ep.method}
              headers={useAuth ? authHeaders : {}}
              title={ep.title}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="post">
          <h2 className="text-xl font-semibold mb-4">POST Edge Functions</h2>
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm">
              POST requests to Edge Functions require proper CORS handling, including preflight OPTIONS requests.
            </p>
          </div>
          {postEndpoints.map((ep) => (
            <UniversalFetcher
              key={ep.url + ep.method}
              url={ep.url}
              method={ep.method}
              payload={ep.payload}
              headers={useAuth ? authHeaders : {}}
              title={ep.title}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllEndpointsFetcher;
