"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Label } from "@/lib/components/ui/label";
import { Input } from "@/lib/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Button } from "@/lib/components/ui/button";
import { currencies } from "@/lib/constants/currencies";
import { Alert, AlertDescription } from "@/lib/components/ui/alert";
import { Copy, Info } from "lucide-react";
import { ImageUpload } from "@/lib/components/ui/image-upload";
import { toast } from "sonner";
import {
  getOrganizationSettings,
  updateOrganizationSettings,
} from "@/lib/api/settings";
import { LoadingState } from "@/lib/components/loading-state";
import { OrganizationSettings } from "@/lib/types/organizaiton-settings";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";

export function OrganisationTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const refreshTrigger = useRefreshStore((state) => state.refreshTrigger);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await getOrganizationSettings();
        setSettings(data);
      } catch (error) {
        toast.error("Failed to load organization settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [refreshTrigger]);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updated = await updateOrganizationSettings({
        uuid: settings.uuid,
        name: settings.name,
        email: settings.email,
        timezone: settings.timezone,
        invPrefix: settings.invPrefix,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!settings) {
    return <div>Error loading settings</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organisation Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Company ID</Label>
          <div className="flex items-center gap-2">
            <Input
              value={settings.uuid}
              readOnly
              className="font-mono bg-muted"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(settings.uuid);
                toast.success("Company ID copied to clipboard");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This is your unique company identifier. It cannot be changed.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Organization Logo</Label>
          <ImageUpload
            value={settings.logoUrl || undefined}
            onChange={(url) => setSettings({ ...settings, logoUrl: url })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Company Name</Label>
          <Input
            id="name"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            placeholder="Indie Dev LLC"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Business Email</Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) =>
              setSettings({ ...settings, email: e.target.value })
            }
            placeholder="contact@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inv_prefix">Invoice Prefix</Label>
          <Input
            id="inv_prefix"
            value={settings.invPrefix || "INV"}
            onChange={(e) =>
              setSettings({ ...settings, invPrefix: e.target.value })
            }
            placeholder="INV"
          />
          <p className="text-sm text-muted-foreground">
            This prefix will be used for all invoice numbers (e.g.,
            INV-2024-001)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={settings.timezone}
            onValueChange={(value) =>
              setSettings({ ...settings, timezone: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
              <SelectItem value="America/Chicago">Central Time</SelectItem>
              <SelectItem value="America/Denver">Mountain Time</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Default Currency</Label>
          <Select value={settings.currency} disabled>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            The default currency cannot be changed after organization creation.
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            To use a different currency, you'll need to create a new
            organization.
          </AlertDescription>
        </Alert>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
