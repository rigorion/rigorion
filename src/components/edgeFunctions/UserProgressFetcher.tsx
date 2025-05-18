
import React from 'react';
import EdgeFunctionFetcher from './EdgeFunctionFetcher';

const UserProgressFetcher = () => {
  // Use the specific token and URL for user progress
  const edgeFunctionUrl = "https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/get-user-progress";
  const authToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkVtWWMvS0Exd0dNdFR2a2ciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2V2ZnhjZHp3bW1pZ3V6eGR4a3RsLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2MGFmZTRjYS0zZjlhLTRlNzItOTE3NS0xNjc4MjI1YWNjNWQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ1NjE0MTE0LCJpYXQiOjE3NDU2MTA1MTQsImVtYWlsIjoicmlnb3Jpb25wbGNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InJpZ29yaW9ucGxjQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoicmlnb3Jpb24iLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjYwYWZlNGNhLTNmOWEtNGU3Mi05MTc1LTE2NzgyMjVhY2M1ZCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQ1MjMyMDIxfV0sInNlc3Npb25faWQiOiIzMzMzZTE3MS1jZTkzLTQ4OWItYmM0MS00ODFlMmE4MTEzMjciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.xH0EHdxHLkDpWFsJ5tHzUuAt2PBsXEEnWk5kdd2b0Qw";

  return (
    <EdgeFunctionFetcher
      url={edgeFunctionUrl}
      title="User Progress Data"
      token={authToken}
      autoRefresh={false}
    />
  );
};

export default UserProgressFetcher;
