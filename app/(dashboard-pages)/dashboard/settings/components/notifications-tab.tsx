"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Label } from "@/lib/components/ui/label";
import { Switch } from "@/lib/components/ui/switch";

export function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="invoice-notifications">Invoice Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications when invoices are paid
            </p>
          </div>
          <Switch id="invoice-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="payment-notifications">Payment Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Send automatic payment reminders
            </p>
          </div>
          <Switch id="payment-notifications" />
        </div>
      </CardContent>
    </Card>
  );
}
