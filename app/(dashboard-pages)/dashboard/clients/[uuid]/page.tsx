"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingState } from "@/components/loading-state";
import { Client, Invoice } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/utilities";
import { capitalizeWords } from "@/lib/utils/utilities";
import { ConfirmDelete } from "@/components/modals/confirm-delete";
import { deleteInvoice } from "@/lib/api_repository/invoices";
import { toast } from "sonner";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import Link from "next/link";
import { Plus, FileText, DollarSign, Clock } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "next/navigation";
import { getClient } from "@/lib/api_repository/clients";
import { getClientInvoices } from "@/lib/api_repository/clients";

export default function ClientPage() {
  const params = useParams<{ uuid: string }>();
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData = await getClient(params.uuid);
        setClient(clientData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoadingClient(false);
      }
    };

    fetchClientData();
  }, [params.uuid]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoices = await getClientInvoices(params.uuid);
        console.log(invoices);
        setInvoices(invoices.invoices);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, [params.uuid]);

  if (loadingClient) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <LoadingState />
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  const handleDeleteClick = async (invoiceId: number) => {
    setSelectedInvoiceId(invoiceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInvoiceId) return;

    try {
      await deleteInvoice(selectedInvoiceId.toString());
      toast.success("Invoice deleted successfully");
      triggerRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete invoice"
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/clients">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{client.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {client.companyName && (
              <div>
                <p className="font-semibold">Company</p>
                <p>{client.companyName}</p>
              </div>
            )}
            {client.phone && (
              <div>
                <p className="font-semibold">Phone</p>
                <p>{client.phone}</p>
              </div>
            )}
            {client.email && (
              <div>
                <p className="font-semibold">Address</p>
                <p>{client.email}</p>
              </div>
            )}
            <div>
              <p className="font-semibold">Client Since</p>
              <p>{new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        </div>
        <Button asChild>
          <Link href="/studio">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      {loadingInvoices ? (
        <LoadingState />
      ) : (
        <>
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
                        new Date(inv.createdAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }{" "}
                  created this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Amount
                </CardTitle>
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
            <div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
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
                          <Link href={`/invoice/${invoice.uuid}`}>
                            <Button variant="link">
                              {invoice.invoiceNumber}
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell>
                          {formatDate(new Date(invoice.issueDate))}
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
                                onClick={() =>
                                  handleDeleteClick(Number(invoice.id))
                                }
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
            </div>
          )}
        </>
      )}

      <ConfirmDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
