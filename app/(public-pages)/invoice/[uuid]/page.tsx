"use client";

import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/utilities";
import {
  Download,
  CheckCircle,
  Loader2,
  Mail,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteInvoice,
  getInvoice,
  markInvoiceAsPaid,
} from "@/lib/api_repository/invoices";
import { Invoice, Product, InvoiceItem } from "@/lib/types";
import { useAuthUser } from "@/lib/hooks/use-auth-user";
import { LoadingState } from "@/components/loading-state";
import Link from "next/link";
import { toast } from "sonner";
import { sendInvoiceToClient } from "@/lib/api_repository/email";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ConfirmDelete } from "@/components/modals/confirm-delete";

export default function InvoicePage() {
  const { user, userLoading } = useAuthUser();
  const params = useParams<{ uuid: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaidStatusUpdating, setIsPaidStatusUpdating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const invoiceDetails = await getInvoice(params.uuid);
        setInvoice(invoiceDetails);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceDetails();
  }, [params.uuid]);

  const handleToggleInvoicePaidStatus = async () => {
    try {
      setIsPaidStatusUpdating(true);
      await markInvoiceAsPaid(params.uuid);
      const updatedInvoice = await getInvoice(params.uuid);
      setInvoice(updatedInvoice);
    } catch (error) {
      console.error("Error toggling invoice paid status:", error);
    } finally {
      setIsPaidStatusUpdating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!invoice!.clientEmail) {
      toast.error("No client email address available");
      return;
    }

    try {
      setIsEmailSending(true);
      await sendInvoiceToClient(params.uuid);
      toast.success(`Invoice sent to ${invoice!.clientEmail}`);
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      setIsDeleting(true);
      await deleteInvoice(params.uuid);
      toast.success("Invoice deleted successfully");
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
    }
  };

  if (userLoading || loading) {
    return <LoadingState />;
  }

  if (!invoice) {
    return notFound();
  }

  return (
    <>
      {/* <div className="border-b bg-white">
        <div className="container flex items-center gap-3 py-4 mx-auto px-4">
          // ... all the desktop and mobile view code ...
        </div>
      </div> */}

      {user && (
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-2">
            <nav className="text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href="/dashboard/invoices"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Invoices
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-700">{invoice.invoiceNumber}</li>
              </ol>
            </nav>
          </div>
        </div>
      )}

      <div className="container py-8 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1280px] mx-auto">
          <div className="flex-1 max-w-[800px] bg-white rounded-lg shadow-sm p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {invoice.invoiceNumber}
              </h1>
              <p className="text-gray-500 mt-1">
                Status: <span className="capitalize">{invoice.status}</span>
              </p>
            </div>

            {/* Dates and Client Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
                <p className="text-gray-700">{invoice.clientName}</p>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Issue Date: </span>
                  <span>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </span>
                </div>
                {invoice.dueDate && (
                  <div>
                    <span className="font-medium">Due Date: </span>
                    <span>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3">Product</th>
                    <th className="text-right py-3">Quantity</th>
                    <th className="text-right py-3">Price</th>
                    <th className="text-right py-3">Discount</th>
                    <th className="text-right py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.products.map((product: InvoiceItem) => (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td className="py-3">{product.name}</td>
                      <td className="text-right">{product.quantity}</td>
                      <td className="text-right">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="text-right">{product.discount}%</td>
                      <td className="text-right">
                        {formatCurrency(product.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-right py-4">
                      Subtotal:
                    </td>
                    <td className="text-right py-4">
                      {formatCurrency(invoice.subtotal)}
                    </td>
                  </tr>
                  {invoice.feesAndAdjustments?.map((adjustment) => (
                    <tr key={adjustment.id}>
                      <td colSpan={4} className="text-right py-2">
                        Adjustment (
                        {adjustment.type === "percentage"
                          ? `${adjustment.amount}%`
                          : "flat"}
                        ):
                      </td>
                      <td className="text-right py-2">
                        {formatCurrency(adjustment.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200">
                    <td colSpan={4} className="text-right py-4 font-semibold">
                      Total:
                    </td>
                    <td className="text-right py-4 font-semibold">
                      {formatCurrency(invoice.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h2 className="text-sm mb-2">Notes:</h2>
                <div className="bg-gray-50 p-4 rounded-lg">{invoice.notes}</div>
              </div>
            )}
            {invoice.terms && (
              <div className="mb-8">
                <h2 className="text-sm mb-2">Terms:</h2>
                <div className="bg-gray-50 p-4 rounded-lg">{invoice.terms}</div>
              </div>
            )}
          </div>

          {/* Right Panel - now visible on mobile */}
          {user && (
            <div className="lg:w-[400px] space-y-4">
              {/* Actions Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-medium mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant={invoice.paid ? "outline" : "default"}
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleToggleInvoicePaidStatus}
                    disabled={isPaidStatusUpdating}
                  >
                    {isPaidStatusUpdating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Mark as {invoice.paid ? "Unpaid" : "Paid"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleSendEmail}
                    disabled={isEmailSending}
                  >
                    {isEmailSending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Mail size={16} />
                    )}
                    Send Invoice
                  </Button>

                  <Link href={`/studio/${params.uuid}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Invoice
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download PDF
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 size={16} />
                    Delete Invoice
                  </Button>
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
                <h3 className="font-medium mb-4">Share Invoice</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">
                      Invoice Link
                    </label>
                    <div className="space-y-2">
                      <code className="text-sm block w-full bg-gray-50 p-3 rounded">
                        {`${window.location.origin}/invoice/${params.uuid}`}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/invoice/${params.uuid}`
                          );
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDelete
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => handleDeleteInvoice()}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </>
  );
}
