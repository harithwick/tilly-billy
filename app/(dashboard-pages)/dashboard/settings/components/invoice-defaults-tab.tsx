"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function InvoiceDefaultsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Defaults</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-numbering">Automatic Numbering</Label>
            <p className="text-sm text-muted-foreground">
              Automatically generate invoice numbers
            </p>
          </div>
          <Switch id="auto-numbering" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="due-date">Default Due Date</Label>
            <p className="text-sm text-muted-foreground">
              Set default payment terms to 30 days
            </p>
          </div>
          <Switch id="due-date" />
        </div>
      </CardContent>
    </Card>
  );
}
