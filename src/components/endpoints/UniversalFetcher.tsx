
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UniversalFetcherProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  payload?: any;
  headers?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  title?: string;
}

const UniversalFetcher = ({
  url,
  method = "GET",
  payload = null,
  headers = {},
  onSuccess = () => {},
  onError = () => {},
  title = "",
}: UniversalFetcherProps) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [payloadInput, setPayloadInput] = useState<string>(
    payload ? JSON.stringify(payload, null, 2) : '{}'
  );

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setData(null);

    // Prepare the fetch options
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      mode: 'cors',
      credentials: 'omit'  // Don't send cookies by default for CORS
    };
    
    // Add payload for POST/PUT methods
    if ((method === "POST" || method === "PUT") && payloadInput) {
      try {
        const parsedPayload = JSON.parse(payloadInput);
        options.body = JSON.stringify(parsedPayload);
      } catch (err) {
        setError("Invalid JSON payload");
        setLoading(false);
        return;
      }
    }

    console.log(`Fetching ${url} with method ${method}`, options);

    fetch(url, options)
      .then(async (res) => {
        if (!res.ok) {
          let errMsg = await res.text();
          throw new Error(errMsg || `Network error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
        onSuccess(json);
      })
      .catch((err) => {
        console.error(`Error fetching ${url}:`, err);
        setError(err.message || "Error");
        setLoading(false);
        onError(err);
      });
  };

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          <span className={`text-xs px-2 py-1 rounded ${
            method === "GET" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
          }`}>{method}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 mb-2 truncate">{url}</p>
      </div>
      
      {/* Payload input for POST methods */}
      {(method === "POST" || method === "PUT") && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payload JSON:
          </label>
          <textarea 
            className="w-full h-24 p-2 border border-gray-300 rounded text-sm font-mono"
            value={payloadInput}
            onChange={(e) => setPayloadInput(e.target.value)}
          />
        </div>
      )}
      
      {/* Fetch button */}
      <div className="mt-3">
        <Button 
          onClick={fetchData}
          disabled={loading}
          variant="outline"
          size="sm"
          className={`${
            method === "GET" ? "border-blue-500 hover:bg-blue-50" : "border-green-500 hover:bg-green-50"
          }`}
        >
          {loading ? "Fetching..." : `Fetch ${method === "GET" ? "Data" : "Send Request"}`}
        </Button>
      </div>
      
      {/* Status indicators */}
      {loading && <div className="text-blue-600 mt-3">🔄 Loading...</div>}
      {error && (
        <div className="text-red-500 mt-3 p-2 bg-red-50 border border-red-100 rounded">
          ❌ Error: {error}
        </div>
      )}
      
      {/* Response data */}
      {data && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Response:</h4>
          <pre className="bg-gray-50 p-3 rounded border border-gray-200 max-h-[300px] overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UniversalFetcher;
