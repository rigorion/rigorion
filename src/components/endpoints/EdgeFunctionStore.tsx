
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  storeFunctionData, 
  getLatestFunctionData 
} from "@/services/dexieService";
import {
  storeSecureFunctionData,
  getSecureLatestFunctionData,
  isSecureStorageActive
} from "@/services/secureIndexedDbService";
import { Loader2, Save, Database, RefreshCw, Lock, Unlock, KeyRound } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const EdgeFunctionStore = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [myFunctionData, setMyFunctionData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [lastFetched, setLastFetched] = useState<{[key: string]: Date | null}>({
    "my-function": null,
    "get-user-progress": null
  });
  const [useEncryption, setUseEncryption] = useState<boolean>(isSecureStorageActive());
  const { toast } = useToast();

  const fetchAndStoreFunction = async (endpoint: string) => {
    setLoading(true);
    try {
      console.log(`Fetching data from ${endpoint}...`);
      
      // Build the full URL
      const baseUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1";
      const url = `${baseUrl}/${endpoint}`;
      
      // Fetch from edge function
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Store in IndexedDB (either encrypted or normal)
      if (useEncryption) {
        await storeSecureFunctionData(endpoint, result);
        toast({
          title: "Encrypted Data Stored",
          description: `Data from ${endpoint} securely encrypted and stored`,
        });
      } else {
        await storeFunctionData(endpoint, result);
        toast({
          title: "Data Stored Successfully",
          description: `Data from ${endpoint} stored in IndexedDB`,
        });
      }
      
      // Update state based on which endpoint was called
      if (endpoint === "my-function") {
        setMyFunctionData(result);
        setLastFetched(prev => ({...prev, "my-function": new Date()}));
      } else if (endpoint === "get-user-progress") {
        setProgressData(result);
        setLastFetched(prev => ({...prev, "get-user-progress": new Date()}));
      }
    } catch (error) {
      console.error(`Error fetching or storing data from ${endpoint}:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch or store data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLatestData = async (endpoint: string) => {
    setLoading(true);
    try {
      // Get latest data from either encrypted or normal storage
      const latestData = useEncryption
        ? await getSecureLatestFunctionData(endpoint)
        : await getLatestFunctionData(endpoint);
      
      if (latestData) {
        // Update state based on which endpoint was called
        if (endpoint === "my-function") {
          setMyFunctionData(latestData.data);
          setLastFetched(prev => ({...prev, "my-function": new Date(latestData.timestamp)}));
        } else if (endpoint === "get-user-progress") {
          setProgressData(latestData.data);
          setLastFetched(prev => ({...prev, "get-user-progress": new Date(latestData.timestamp)}));
        }
        
        toast({
          title: "Data Loaded",
          description: useEncryption
            ? `Encrypted data from ${endpoint} decrypted and loaded`
            : `Latest data from ${endpoint} loaded from IndexedDB`,
        });
      } else {
        if (endpoint === "my-function") {
          setMyFunctionData(null);
        } else if (endpoint === "get-user-progress") {
          setProgressData(null);
        }
        
        toast({
          title: "No Data Found",
          description: `No data found for ${endpoint}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error loading data from ${endpoint}:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data from IndexedDB on component mount
  useEffect(() => {
    loadLatestData("my-function");
    loadLatestData("get-user-progress");
  }, [useEncryption]); // Reload when encryption setting changes

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" /> Edge Function Storage
        </CardTitle>
        <CardDescription>Store and retrieve data from edge functions securely in IndexedDB</CardDescription>
        
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="encryption-mode"
            checked={useEncryption}
            onCheckedChange={setUseEncryption}
          />
          <Label htmlFor="encryption-mode" className="flex items-center cursor-pointer">
            {useEncryption ? (
              <>
                <Lock className="h-4 w-4 mr-1 text-green-600" /> 
                <span>Using Encrypted Storage</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-1 text-amber-600" /> 
                <span>Using Standard Storage</span>
              </>
            )}
          </Label>
        </div>
        {useEncryption && (
          <p className="text-xs text-green-600 mt-1">
            <KeyRound className="h-3 w-3 inline mr-1" /> 
            Data is encrypted with AES-GCM before storage and only decrypted in memory when accessed
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* My Function Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">my-function</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => fetchAndStoreFunction("my-function")}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {useEncryption ? "Fetch & Encrypt" : "Fetch & Store"}
              </Button>
              
              <Button
                size="sm"
                onClick={() => loadLatestData("my-function")}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Load Latest
              </Button>
            </div>
            
            {lastFetched["my-function"] && (
              <p className="text-xs text-gray-500 mb-2">
                Last updated: {lastFetched["my-function"]?.toLocaleTimeString()}
              </p>
            )}
            
            {myFunctionData ? (
              <pre className="bg-gray-50 p-3 rounded border text-xs overflow-auto max-h-64">
                {JSON.stringify(myFunctionData, null, 2)}
              </pre>
            ) : (
              <div className="text-center py-4 text-gray-400">
                No data available. Fetch or load data.
              </div>
            )}
          </div>
          
          {/* User Progress Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">get-user-progress</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                size="sm"
                onClick={() => fetchAndStoreFunction("get-user-progress")}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {useEncryption ? "Fetch & Encrypt" : "Fetch & Store"}
              </Button>
              
              <Button
                size="sm"
                onClick={() => loadLatestData("get-user-progress")}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Load Latest
              </Button>
            </div>
            
            {lastFetched["get-user-progress"] && (
              <p className="text-xs text-gray-500 mb-2">
                Last updated: {lastFetched["get-user-progress"]?.toLocaleTimeString()}
              </p>
            )}
            
            {progressData ? (
              <pre className="bg-gray-50 p-3 rounded border text-xs overflow-auto max-h-64">
                {JSON.stringify(progressData, null, 2)}
              </pre>
            ) : (
              <div className="text-center py-4 text-gray-400">
                No data available. Fetch or load data.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EdgeFunctionStore;
