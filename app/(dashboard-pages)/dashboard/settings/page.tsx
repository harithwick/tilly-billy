"use client";

import { Breadcrumb } from "@/lib/components/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import { OrganisationTab } from "./components/organisation-tab";
import { CollaboratorsTab } from "./components/collaborators-tab";
import { DangerZoneTab } from "./components/danger-zone-tab";
import { PreferencesTab } from "./components/preferences-tab";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>

      <Tabs defaultValue="organisation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          {/* <TabsTrigger value="collaborators">Collaborators</TabsTrigger> */}
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        <TabsContent value="organisation" className="space-y-4">
          <OrganisationTab />
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
          <PreferencesTab />
        </TabsContent>
        {/* <TabsContent value="collaborators" className="space-y-4">
          <CollaboratorsTab />
        </TabsContent> */}
        <TabsContent value="danger" className="space-y-4">
          <DangerZoneTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
