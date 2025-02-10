"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Button } from "@/lib/components/ui/button";
import { useState, useEffect } from "react";
import {
  PaymentDetailsModal,
  PaymentDetail,
} from "@/lib/components/studio/payment-details-modal";
import { Plus, Check, Trash2, MoreVertical, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Badge } from "@/lib/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/components/ui/alert-dialog";

interface PaymentDetailFromAPI {
  id: string;
  label: string;
  type: string;
  details: string;
  default: boolean;
  createdAt: string;
  updatedAt: string;
}

export function PreferencesTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailFromAPI[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetailToDelete, setPaymentDetailToDelete] = useState<
    string | null
  >(null);
  const [editingPaymentDetail, setEditingPaymentDetail] =
    useState<PaymentDetailFromAPI | null>(null);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch("/api/dashboard/settings/payment-details");
      if (!response.ok) throw new Error("Failed to fetch payment details");
      const data = await response.json();
      setPaymentDetails(data);
    } catch (error) {
      toast.error("Failed to load payment details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const handleAddPaymentDetail = async (
    newDetail: Omit<PaymentDetail, "id">
  ) => {
    try {
      const response = await fetch("/api/dashboard/settings/payment-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newDetail.name,
          type: newDetail.type,
          details: newDetail.value,
          default: paymentDetails.length === 0, // Make first added detail default
        }),
      });

      if (!response.ok) throw new Error("Failed to add payment detail");

      await fetchPaymentDetails();
      setIsModalOpen(false);
      toast.success("Payment detail added successfully");
    } catch (error) {
      toast.error("Failed to add payment detail");
      console.error(error);
    }
  };

  const setDefaultPaymentDetail = async (id: string) => {
    try {
      const response = await fetch("/api/dashboard/settings/payment-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          default: true,
          // Include existing values
          ...paymentDetails.find((detail) => detail.id === id),
        }),
      });

      if (!response.ok) throw new Error("Failed to update payment detail");

      await fetchPaymentDetails();
      toast.success("Default payment method updated");
    } catch (error) {
      toast.error("Failed to update default payment method");
      console.error(error);
    }
  };

  const deletePaymentDetail = async (id: string) => {
    try {
      const response = await fetch(
        `/api/dashboard/settings/payment-details?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete payment detail");
      }

      await fetchPaymentDetails();
      toast.success("Payment detail deleted successfully");
      setPaymentDetailToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete payment detail"
      );
      console.error(error);
    }
  };

  const handleEditPaymentDetail = async (
    editedDetail: Omit<PaymentDetail, "id">
  ) => {
    try {
      const response = await fetch("/api/dashboard/settings/payment-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPaymentDetail!.id,
          label: editedDetail.name,
          type: editedDetail.type,
          details: editedDetail.value,
          default: editingPaymentDetail!.default,
        }),
      });

      if (!response.ok) throw new Error("Failed to update payment detail");

      await fetchPaymentDetails();
      setEditingPaymentDetail(null);
      toast.success("Payment detail updated successfully");
    } catch (error) {
      toast.error("Failed to update payment detail");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Details</CardTitle>
          <Button onClick={() => setIsModalOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Detail
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-24"
                  >
                    Loading payment details...
                  </TableCell>
                </TableRow>
              ) : paymentDetails.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-24"
                  >
                    No payment details added yet. Click the button above to add
                    your first payment detail.
                  </TableCell>
                </TableRow>
              ) : (
                paymentDetails.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-medium">
                      {detail.label}
                    </TableCell>
                    <TableCell className="capitalize">{detail.type}</TableCell>
                    <TableCell>
                      {detail.type === "link" ? (
                        <a
                          href={detail.details}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {detail.details}
                        </a>
                      ) : (
                        <span className="whitespace-pre-wrap">
                          {detail.details}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(detail.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {detail.default && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            aria-label="Open menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          {!detail.default && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingPaymentDetail(detail);
                                  setIsModalOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setDefaultPaymentDetail(detail.id)
                                }
                                className="cursor-pointer"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Make Default
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setPaymentDetailToDelete(detail.id)
                                }
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                          {detail.default && (
                            <DropdownMenuItem disabled>
                              <Check className="mr-2 h-4 w-4" />
                              Default Method
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={paymentDetailToDelete !== null}
        onOpenChange={(open) => !open && setPaymentDetailToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment detail. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                paymentDetailToDelete &&
                deletePaymentDetail(paymentDetailToDelete)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentDetailsModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPaymentDetail(null);
        }}
        onSave={
          editingPaymentDetail
            ? handleEditPaymentDetail
            : handleAddPaymentDetail
        }
        editingPaymentDetail={
          editingPaymentDetail
            ? {
                id: editingPaymentDetail.id,
                label: editingPaymentDetail.label,
                type: editingPaymentDetail.type as "link" | "details",
                details: editingPaymentDetail.details,
              }
            : undefined
        }
      />
    </div>
  );
}
