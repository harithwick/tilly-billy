"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { deleteOrganization } from "@/lib/api_repository/organization";
export function DangerZoneTab() {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteOrganization();
      Cookies.remove("activeOrgUuid");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Irreversible and destructive actions
        </p>
      </div>
      <>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Delete Organization
            </CardTitle>
            <CardDescription>
              Permanently delete your organization and all of its data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. This will permanently delete your
                organization account and remove all associated data from our
                servers.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => setConfirmDialogOpen(true)}
            >
              Delete Organization
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                organization and remove all associated data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Please type{" "}
                <span className="font-semibold">delete my organization</span> to
                confirm
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my organization"
              />
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== "delete my organization" || loading}
              >
                {loading ? "Deleting..." : "Delete Organization"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
}
