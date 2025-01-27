"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/lib/components/ui/tabs";
import { Users, UserPlus, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { EmptyState } from "@/lib/components/empty-state";
import { ConfirmDelete } from "@/lib/components/confirm-delete";
import { CreateClientModal } from "@/lib/components/clients/create-client-modal";
import { LoadingState } from "@/lib/components/loading-state";
import { cn, capitalizeWords } from "@/lib/utils";
import { deleteClient } from "@/lib/api/clients";
import { useClients } from "@/lib/hooks/use-clients";
import Link from "next/link";
import { useRefreshStore } from "@/lib/stores/use-refresh-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import { Client } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";

export default function ClientsPage() {
  const [status, setStatus] = useState("active");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { clients, loading, error } = useClients();
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading clients: {error}</p>
      </div>
    );
  }

  const handleDeleteClick = async (clientId: number) => {
    setSelectedClientId(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClientId) return;

    try {
      await deleteClient(selectedClientId.toString());
      toast.success("Client deleted successfully");
      triggerRefresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete client"
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedClientId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage your client relationships.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Client
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              {clients.filter((c) => c.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                clients.filter((c) => {
                  const createdDate = new Date(c.createdAt);
                  const now = new Date();
                  return (
                    createdDate.getMonth() === now.getMonth() &&
                    createdDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Added this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" onClick={() => setStatus("active")}>
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" onClick={() => setStatus("inactive")}>
            Inactive
          </TabsTrigger>
          <TabsTrigger value="archived" onClick={() => setStatus("archived")}>
            Archived
          </TabsTrigger>
        </TabsList>

        {["active", "inactive", "archived"].map((status) => (
          <TabsContent key={status} value={status}>
            {clients.filter((c) => c.status === status).length === 0 ? (
              <EmptyState
                icon={Users}
                title={
                  status === "active"
                    ? "No active clients"
                    : `No ${status} clients`
                }
                description={
                  "Add a client or change the status of existing clients to see them here."
                }
                actionLabel={"Add Client"}
                onAction={() => setCreateModalOpen(true)}
              />
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Invoices</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients
                      .filter((c) => c.status === status)
                      .map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <Link href={`/dashboard/client/${client.id}`}>
                              {client.name}
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {client.email || "-"}
                          </TableCell>
                          <TableCell>{client.company || "-"}</TableCell>
                          <TableCell>{client.name || 0}</TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                client.status === "active" &&
                                  "bg-green-100 text-green-800",
                                client.status === "inactive" &&
                                  "bg-yellow-100 text-yellow-800",
                                client.status === "archived" &&
                                  "bg-gray-100 text-gray-800"
                              )}
                            >
                              {capitalizeWords(client.status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setCreateModalOpen(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                {status !== "archived" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // TODO: Implement status change
                                      console.log("Change status to archived");
                                    }}
                                  >
                                    Archive
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleDeleteClick(Number(client.id))
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
            )}
          </TabsContent>
        ))}
      </Tabs>
      <CreateClientModal
        open={createModalOpen}
        onSuccess={() => {
          triggerRefresh();
        }}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) {
            setSelectedClient(null);
          }
        }}
        client={selectedClient}
      />
      <ConfirmDelete
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        description="Are you sure you want to delete this client? This action cannot be undone and will remove all associated data."
        title="Delete Client"
      />
    </div>
  );
}
