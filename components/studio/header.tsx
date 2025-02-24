"use client";
import { Code2, Save, ArrowLeft } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/confirmation-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function Header() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  function handleConfirm() {
    if (
      confirm(
        "Any unsaved changes will be lost. Are you sure you want to leave?"
      )
    ) {
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link
                href="/dashboard/invoices"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Invoices
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
        </div>
      </div>
      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
        title="Are you sure?"
        description="This action cannot be undone."
        actionLabel="Delete"
        variant="destructive"
        loading={loadingModal}
      />
    </header>
  );
}
