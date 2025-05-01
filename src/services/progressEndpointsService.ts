const SUPABASE_URL = "https://eantvimmgdmxzwrjwrop.supabase.co";
const API_VERSION = "v1";

/**
 * Try a direct HTTP GET to your edge function, 
 * then fall back to supabase.functions.invoke()
 */
async function fetchWithInvokeFallback(
  endpoint: string,
  authToken?: string
): Promise<any> {
  const url = `${SUPABASE_URL}/functions/${API_VERSION}/${endpoint}`;
  const headers: Record<string,string> = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  // 1️⃣ Primary: direct fetch
  try {
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok) {
      throw new Error(`Fetch failed ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (fetchErr) {
    console.warn(`Direct fetch failed for ${endpoint}:`, fetchErr);

    // 2️⃣ Fallback: supabase.functions.invoke
    const invokeOpts = { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} };
    const { data, error } = await supabase.functions.invoke(endpoint, invokeOpts);
    if (error) {
      console.error(`Invoke fallback also failed for ${endpoint}:`, error);
      throw error;
    }
    return data;
  }
}

export async function fetchProgressEndpoints() {
  const endpoints = {
    userProgress: "get-user-progress",
    progress:     "get-progress",
    leaderboard:  "get-leaders-board",
    satMath:      "get-sat-math-questions",
    satModel:     "get-sat-model-question",
    interactions: "log-interaction",
  };

  const results: Record<string, any> = {};
  const failed: string[] = [];

  // Grab session token once
  const { data: { session } } = await supabase.auth.getSession();
  const authToken = session?.access_token;

  await Promise.all(
    Object.entries(endpoints).map(async ([key, endpoint]) => {
      try {
        results[key] = await fetchWithInvokeFallback(endpoint, authToken);
      } catch {
        failed.push(key);
        results[key] = null;
      }
    })
  );

  if (failed.length) {
    toast.error(`Failed to load: ${failed.join(", ")}`);
  }

  return results;
}
