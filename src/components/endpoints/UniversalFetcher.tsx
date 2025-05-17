
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
    };
    
    if (method === "POST" && payload) {
      options.body = JSON.stringify(payload);
    }

    fetch(url, options)
      .then(async (res) => {
        if (!res.ok) {
          let errMsg = await res.text();
          throw new Error(errMsg || "Network error");
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
        onSuccess(json);
      })
      .catch((err) => {
        setError(err.message || "Error");
        setLoading(false);
        onError(err);
      });

    // Only rerun if url, method, or payload/headers change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, JSON.stringify(payload), JSON.stringify(headers)]);

  return (
    <div className="mb-8 p-4 border border-gray-200 rounded-lg">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {loading && <div className="text-blue-600">🔄 Loading...</div>}
      {error && (
        <div className="text-red-500">❌ Error: {error}</div>
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
