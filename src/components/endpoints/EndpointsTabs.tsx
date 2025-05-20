
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllEndpointsFetcher from "@/components/endpoints/AllEndpointsFetcher";
import CorsDiagnosticTool from "@/components/endpoints/CorsDiagnosticTool";
import TableDataFetcher from "@/components/endpoints/TableDataFetcher";
import TableFetcher from "@/components/supabase/TableFetcher";
import SatMathProgressTable from "@/components/tables/SatMathProgressTable";
import MyFunctionTable from "@/components/tables/MyFunctionTable";
import LogInteraction from "@/components/progress/LogInteraction";
import LogInteractionTable from "@/components/tables/LogInteractionTable";
import SimpleEncryptedDataFetcher from "@/components/endpoints/SimpleEncryptedDataFetcher";
import EncryptedFunctionFetcher from "@/components/endpoints/EncryptedFunctionFetcher";
import ClientSideDecryptionFetcher from "@/components/endpoints/ClientSideDecryptionFetcher";
import EndpointsIntro from "@/components/endpoints/EndpointsIntro";
import EndpointsAesExplanation from "@/components/endpoints/EndpointsAesExplanation";
import ClientDecryptionExplanation from "@/components/endpoints/ClientDecryptionExplanation";
import FetchAllTablesButton from "@/components/endpoints/FetchAllTablesButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EndpointsTabs = () => {
  return (
    <Tabs defaultValue="explorer" className="w-full mb-8">
      <TabsList>
        <TabsTrigger value="explorer">Data Explorer</TabsTrigger>
        <TabsTrigger value="diagnostic">CORS Diagnostic</TabsTrigger>
        <TabsTrigger value="tables">Tables</TabsTrigger>
        <TabsTrigger value="simple">Simple Fetcher</TabsTrigger>
        <TabsTrigger value="sat-math">SAT Math Progress</TabsTrigger>
        <TabsTrigger value="my-function">My Function</TabsTrigger>
        <TabsTrigger value="log-interaction">Log Interaction</TabsTrigger>
        <TabsTrigger value="encrypted">Encrypted Data</TabsTrigger>
        <TabsTrigger value="client-decrypt">Client Decryption</TabsTrigger>
      </TabsList>
      
      <TabsContent value="explorer">
        <EndpointsIntro />
        <AllEndpointsFetcher />
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
      
      <TabsContent value="tables">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Table Data Explorer</CardTitle>
            <CardDescription>Directly query Supabase tables</CardDescription>
          </CardHeader>
          <CardContent>
            <FetchAllTablesButton />
            <TableDataFetcher />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="simple">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Simple Table Fetcher</CardTitle>
            <CardDescription>A simplified interface for querying Supabase tables</CardDescription>
          </CardHeader>
          <CardContent>
            <TableFetcher defaultTable="community_stats" />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sat-math">
        <SatMathProgressTable />
      </TabsContent>
      
      <TabsContent value="my-function">
        <MyFunctionTable />
      </TabsContent>
      
      <TabsContent value="log-interaction">
        <div className="grid grid-cols-1 gap-6">
          <LogInteraction />
          <LogInteractionTable />
        </div>
      </TabsContent>
      
      <TabsContent value="encrypted">
        <div className="grid grid-cols-1 gap-6">
          <SimpleEncryptedDataFetcher />
          <EncryptedFunctionFetcher 
            url="https://eantvimmgdmxzwrjwrop.supabase.co/functions/v1/encrypted-data"
            title="Encrypted Function Data"
            description="Data from encrypted-data endpoint using AES-GCM"
          />
          <EndpointsAesExplanation />
        </div>
      </TabsContent>

      <TabsContent value="client-decrypt">
        <div className="grid grid-cols-1 gap-6">
          <ClientSideDecryptionFetcher />
          <ClientDecryptionExplanation />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EndpointsTabs;
