"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useInvoices } from "@/lib/hooks/use-invoices";
import { LoadingState } from "@/components/loading-state";
import { deleteInvoice } from "@/lib/api_repository/invoices";
import { formatCurrency, capitalizeWords } from "@/lib/utils/utilities";
import { format } from "date-fns";
import { TemplateSelectorModal } from "@/components/invoices/templates/template-selector-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Clock, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDelete } from "@/components/modals/confirm-delete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import { useRouter } from "next/navigation";
export default function InvoicesPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceUuid, setSelectedInvoiceUuid] = useState<string | null>(
    null
  );
  const { invoices, loading, error } = useInvoices();
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading invoices: {error}</p>
      </div>
    );
  }

  const handleTemplateSelect = (templateId: string) => {
    // TODO: Create new invoice with selected template
    console.log("Selected template:", templateId);
    router.push("/studio");
  };

  const handleDeleteClick = async (uuid: string) => {
    setSelectedInvoiceUuid(uuid);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("Deleting invoice with UUID:", selectedInvoiceUuid);
    if (!selectedInvoiceUuid) return;

    try {
      await deleteInvoice(selectedInvoiceUuid);
      toast.success("Invoice deleted successfully");
      triggerRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete invoice"
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedInvoiceUuid(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">
            Manage and track your invoices.
          </p>
        </div>
        <Button asChild>
          <Link href="/studio">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                invoices.filter(
                  (inv) =>
                    new Date(inv.createdAt).getMonth() === new Date().getMonth()
                ).length
              }{" "}
              created this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices.reduce((sum, inv) => sum + inv.total, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              From {invoices.length} invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payment
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                invoices
                  .filter((inv) => inv.status === "pending")
                  .reduce((sum, inv) => sum + inv.total, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {invoices.filter((inv) => inv.status === "pending").length}{" "}
              invoices pending
            </p>
          </CardContent>
        </Card>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to get started."
          actionLabel="Create Invoice"
          onAction={() => {}}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link
                      href={`/invoice/${invoice.uuid}`}
                      className="hover:underline text-primary"
                    >
                      <Button variant="link"> {invoice.invoiceNumber}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/clients/${invoice.clientUUID}`}
                      className="hover:underline text-primary"
                    >
                      <Button variant="link"> {invoice.clientName}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>{capitalizeWords(invoice.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View PDF</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClick(invoice.uuid)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ConfirmDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDeleteConfirm()}
        title="Are you sure you want to delete this invoice?"
        description="This action cannot be undone."
      />
    </div>
  );
}
