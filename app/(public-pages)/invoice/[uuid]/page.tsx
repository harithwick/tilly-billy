"use client";

import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/utilities";
import { Download, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getInvoice } from "@/lib/api_repository/invoices";
import { Invoice } from "@/lib/types";
interface Product {
  id: number;
  discount: number;
  quantity: number;
  product_id: number;
  total_price: number;
}

export default function InvoicePage() {
  const params = useParams<{ uuid: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {invoice.invoiceNumber}
          </h1>
          <p className="text-gray-500 mt-1">
            Status: <span className="capitalize">{invoice.status}</span>
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Download PDF
        </Button>
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
            {/* {invoice.products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="py-3">Product #{product.product_id}</td>
                <td className="text-right">{product.quantity}</td>
                <td className="text-right">{product.discount}%</td>
                <td className="text-right">
                  {formatCurrency(product.total_price)}
                </td>
              </tr>
            ))} */}
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
  );
}
