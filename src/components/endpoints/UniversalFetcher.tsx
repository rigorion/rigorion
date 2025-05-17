
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setLoading(true);
    setError(null);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      mode: 'cors',
      credentials: 'omit'  // Don't send cookies by default for CORS
    };
    
    if (method === "POST" && payload) {
      options.body = JSON.stringify(payload);
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

    // Only rerun if url, method, or payload/headers change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, JSON.stringify(payload), JSON.stringify(headers)]);

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{method}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 mb-2 truncate">{url}</p>
      </div>
      
      {loading && <div className="text-blue-600 mt-2">🔄 Loading...</div>}
      {error && (
        <div className="text-red-500 mt-2">❌ Error: {error}</div>
      )}
      {data && (
        <pre className="bg-gray-50 p-3 rounded mt-2 max-h-[300px] overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default UniversalFetcher;
