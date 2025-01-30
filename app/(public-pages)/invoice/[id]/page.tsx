import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Download, CheckCircle } from "lucide-react";

export default async function PublicInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await db.invoice.findUnique({
    where: {
      id: params.id,
    },
    include: {
      items: true,
      customer: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <p className="text-muted-foreground">
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {!invoice.isPaid && (
              <form action="/api/invoice/mark-paid" method="POST">
                <input type="hidden" name="invoiceId" value={invoice.id} />
                <Button size="sm" type="submit">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">From</h3>
            <p>Your Company Name</p>
            <p>Your Address</p>
            <p>Your Contact Info</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Bill To</h3>
            <p>{invoice.customer.name}</p>
            <p>{invoice.customer.email}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="text-right py-2">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right py-2 font-semibold">
                Total:
              </td>
              <td className="text-right py-2 font-semibold">
                {formatCurrency(invoice.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {invoice.notes && (
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
