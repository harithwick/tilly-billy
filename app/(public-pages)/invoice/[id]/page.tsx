"use client";

import { notFound } from "next/navigation";
import { Button } from "@/lib/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Download, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/lib/components/ui/textarea";

// Dummy invoice data type
type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  createdAt: Date;
  status: "PAID" | "PENDING" | "OVERDUE";
  client: {
    name: string;
    email: string;
    address: string;
  };
  items: InvoiceItem[];
  notes?: string;
};

// Dummy data function
function getDummyInvoice(id: string): Invoice | null {
  // In a real app, you'd fetch this from an API/database
  return {
    id,
    invoiceNumber: "INV-2024-001",
    createdAt: new Date("2024-03-15"),
    status: "PENDING",
    client: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Business Street\nNew York, NY 10001\nUnited States",
    },
    items: [
      {
        description: "Website Design",
        quantity: 1,
        price: 2500,
      },
      {
        description: "Logo Design",
        quantity: 1,
        price: 500,
      },
      {
        description: "Hosting (per month)",
        quantity: 12,
        price: 29,
      },
    ],
    notes:
      "Payment due within 30 days. Please include invoice number with payment.",
  };
}

export default function PublicInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = getDummyInvoice(params.id);
  const [notes, setNotes] = useState<string>("");

  if (!invoice) {
    notFound();
  }

  const total = invoice.items.reduce(
    (acc: number, item: InvoiceItem) => acc + item.quantity * item.price,
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="grid md:grid-cols-[1fr,300px] gap-6">
        {/* Main Invoice Content */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-semibold">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <p className="text-gray-500">
              Created on {invoice.createdAt.toLocaleDateString()}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="font-medium mb-2">Bill To:</h2>
              <div className="text-gray-600">
                <p>{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>

            <div>
              <h2 className="font-medium mb-2">Status:</h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  invoice.status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : invoice.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Quantity</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: InvoiceItem, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="text-right py-2">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
              <tr className="font-medium">
                <td colSpan={3} className="text-right py-4">
                  Total:
                </td>
                <td className="text-right py-4">{formatCurrency(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Notes</h2>
            <p className="text-sm text-gray-500 mb-4">
              Add any additional notes or comments about this invoice
            </p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your notes here..."
              className="min-h-[200px]"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                // In a real app, this would save the notes
                console.log("Saving notes:", notes);
              }}
              className="w-full"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
