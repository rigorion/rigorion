
import { useState, useEffect } from "react";
import UniversalFetcher from "./UniversalFetcher";
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_URL } from "@/integrations/supabase/client";

interface Endpoint {
  url: string;
  title: string;
  method: "GET" | "POST";
  payload?: any;
}

const AllEndpointsFetcher = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [authHeaders, setAuthHeaders] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Define base endpoints
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
        url: `${SUPABASE_URL}/functions/v1/mock`,
        title: "mock tests (GET)",
        method: "GET"
      }
    ];

    // Set the endpoints
    setEndpoints(baseEndpoints);

    // Get authentication token if user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setAuthHeaders({
          Authorization: `Bearer ${data.session.access_token}`
        });
        setIsAuthenticated(true);
        console.log("User is authenticated, will include auth token in requests");
      } else {
        console.log("User is not authenticated");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Optional POST example
  const postExample: Endpoint = {
    url: `${SUPABASE_URL}/functions/v1/log-interaction`,
    title: "Log Interaction (POST example)",
    method: "POST",
    payload: {
      // Demo payload – replace with real data as needed
      question_id: 1,
      user_id: "example_user"
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold mb-2">🧑‍💻 Supabase Edge Functions – Data Fetching Demo</h1>
      <p className="mb-8">Below are all the endpoint responses fetched using a single universal component. 🚀</p>
      
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="font-medium">
          Auth Status: {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {isAuthenticated 
            ? "Auth token will be included with requests" 
            : "Requests will be made without authentication"}
        </p>
      </div>

      {endpoints.map((ep) => (
        <UniversalFetcher
          key={ep.url + ep.method}
          url={ep.url}
          method={ep.method}
          headers={authHeaders}
          title={ep.title}
        />
      ))}

      {/* Uncomment to enable POST example */}
      {/* <UniversalFetcher
        url={postExample.url}
        method={postExample.method}
        payload={postExample.payload}
        headers={authHeaders}
        title={postExample.title}
      /> */}
    </div>
  );
};

export default AllEndpointsFetcher;
