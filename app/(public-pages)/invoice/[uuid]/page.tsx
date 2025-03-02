"use client";

import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/utilities";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getInvoice, markInvoiceAsPaid } from "@/lib/api_repository/invoices";
import { Invoice, Product, InvoiceItem } from "@/lib/types";
import { useAuthUser } from "@/lib/hooks/use-auth-user";
import { LoadingState } from "@/components/loading-state";
import Link from "next/link";

export default function InvoicePage() {
  const { user, userLoading } = useAuthUser();
  const params = useParams<{ uuid: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaidStatusUpdating, setIsPaidStatusUpdating] = useState(false);

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

  if (userLoading || loading) {
    return <LoadingState />;
  }

  if (!invoice) {
    return notFound();
  }

  return (
    <>
      <div className="border-b bg-white">
        <div className="container  flex items-center gap-3 py-4 mx-auto px-4">
          <Button
            variant="default"
            className="ml-auto flex items-center gap-2"
            onClick={handleToggleInvoicePaidStatus}
            disabled={isPaidStatusUpdating}
          >
            {isPaidStatusUpdating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
            Mark as {invoice.paid === true ? "Unpaid" : "Paid"}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Download PDF
          </Button>
        </div>
      </div>
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
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
                <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              {invoice.dueDate && (
                <div>
                  <span className="font-medium">Due Date: </span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
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
                  <th className="text-right py-3">Discount</th>
                  <th className="text-right py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((product: InvoiceItem) => (
                  <tr key={product.id} className="border-b border-gray-200">
                    <td className="py-3">{product.name}</td>
                    <td className="text-right">{product.quantity}</td>
                    <td className="text-right">{product.discount}%</td>
                    <td className="text-right">
                      {formatCurrency(product.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-4 font-semibold">
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
              <h2 className="text-lg font-semibold mb-2">Notes:</h2>
              <div className="bg-gray-50 p-4 rounded-lg">{invoice.notes}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
