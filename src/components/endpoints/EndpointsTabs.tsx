
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CorsDiagnosticTool from "@/components/endpoints/CorsDiagnosticTool";
import MyFunctionTable from "@/components/tables/MyFunctionTable";
import LogInteraction from "@/components/progress/LogInteraction";
import LogInteractionTable from "@/components/tables/LogInteractionTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IndexedDbExplorer from "@/components/endpoints/IndexedDbExplorer";
import LocalDataManager from "@/components/endpoints/LocalDataManager";

const EndpointsTabs = () => {
  return (
    <Tabs defaultValue="my-function" className="w-full mb-8">
      <TabsList>
        <TabsTrigger value="my-function">Edge Function</TabsTrigger>
        <TabsTrigger value="local-data">Local Data</TabsTrigger>
        <TabsTrigger value="log-interaction">Log Interaction</TabsTrigger>
        <TabsTrigger value="diagnostic">CORS Diagnostic</TabsTrigger>
      </TabsList>
      
      <TabsContent value="my-function">
        <Card>
          <CardHeader>
            <CardTitle>Edge Function Data</CardTitle>
            <CardDescription>Fetch data from Supabase edge functions and store locally</CardDescription>
          </CardHeader>
          <CardContent>
            <MyFunctionTable />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="local-data">
        <div className="grid grid-cols-1 gap-6">
          <LocalDataManager />
          <IndexedDbExplorer />
        </div>
      </TabsContent>
      
      <TabsContent value="log-interaction">
        <div className="grid grid-cols-1 gap-6">
          <LogInteraction />
          <LogInteractionTable />
        </div>
      </TabsContent>
      
      <TabsContent value="diagnostic">
        <Card>
          <CardHeader>
            <CardTitle>CORS Diagnostic Tool</CardTitle>
            <CardDescription>Test for CORS issues with Supabase Edge Functions</CardDescription>
          </CardHeader>
          <CardContent>
            <CorsDiagnosticTool />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EndpointsTabs;
