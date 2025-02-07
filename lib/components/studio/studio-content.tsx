"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/lib/components/ui/card";
import { Label } from "@/lib/components/ui/label";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import { Textarea } from "@/lib/components/ui/textarea";
import { Calendar } from "@/lib/components/ui/calendar";
import { ConfirmationModal } from "@/lib/components/confirmation-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/lib/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ClientSelector } from "@/lib/components/clients/client-selector";
import { ProductSelector } from "@/lib/components/products/product-selector";
import { useStudio } from "@/lib/hooks/use-studio";
import { LoadingState } from "@/lib/components/loading-state";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Header } from "@/lib/components/studio/header";
import { Suspense } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Add this type near the top of the file
type TaxItem = {
  name: string;
  percentage: number;
};

export default function StudioContent({ uuid }: { uuid?: string }) {
  const [date, setDate] = useState<Date>();
  const [items, setItems] = useState<
    Array<{
      description: string;
      quantity: number;
      rate: number;
      discount: number;
      amount: number;
    }>
  >([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");
  const { data, loading, error } = useStudio(invoiceId || null);
  const [activeView, setActiveView] = useState<"invoice" | "pdf">("pdf");
  const [invoiceNumber, setInvoiceNumber] = useState("INV2398-08-087");
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("due_on_receipt");
  const [issueDate, setIssueDate] = useState<Date>();
  const [taxes, setTaxes] = useState<TaxItem[]>([
    { name: "Tax", percentage: 10 },
  ]);

  useEffect(() => {
    if (data?.invoice) {
      // Populate form with invoice data
      setDate(new Date(data.invoice.issueDate));
      setSelectedClient(data.invoice.clientId);
      setItems(
        data.invoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          discount: 0,
          amount: item.amount,
        }))
      );
    }
  }, [data]);

  const handleConfirm = async () => {
    setLoadingModal(true);
    try {
      // await someAction();
      setConfirmOpen(false);
    } finally {
      setLoadingModal(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Error loading studio data: {error}</p>
      </div>
    );
  }

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, rate: 0, discount: 0, amount: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const hasDiscounts = items.some((item) => item.discount > 0);

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const totalTax = taxes.reduce((acc, tax) => {
    return acc + subtotal * (tax.percentage / 100);
  }, 0);
  const total = subtotal + totalTax;

  // Add a helper function to get readable payment terms
  const getReadablePaymentTerms = (terms: string) => {
    switch (terms) {
      case "due_on_receipt":
        return "Due on Receipt";
      case "net_15":
        return "Net 15 Days";
      case "net_30":
        return "Net 30 Days";
      case "net_45":
        return "Net 45 Days";
      case "net_60":
        return "Net 60 Days";
      case "custom":
        return "Custom Terms";
      default:
        return terms;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add invoice header
    doc.setFontSize(20);
    doc.text(invoiceNumber, 20, 20);

    // Add issue date and subject
    doc.setFontSize(12);
    doc.text("Issue date:", 20, 35);
    doc.text(issueDate ? format(issueDate, "d MMMM yyyy") : "Not set", 60, 35);
    doc.text("Subject:", 20, 45);
    doc.text("Service per June 2023", 60, 45);

    // Add payment terms after the dates
    doc.text("Payment Terms:", 20, 55);
    doc.text(getReadablePaymentTerms(paymentTerms), 60, 55);

    // Add items table
    autoTable(doc, {
      startY: 70,
      head: [
        hasDiscounts
          ? ["Description", "Qty", "Unit Price", "Discount", "Amount"]
          : ["Description", "Qty", "Unit Price", "Amount"],
      ],
      body: items.map((item) => {
        const row = [
          item.description,
          item.quantity.toString(),
          item.rate.toString(),
        ];
        if (hasDiscounts) {
          row.push(item.discount > 0 ? `${item.discount}%` : "-");
        }
        row.push(item.amount.toFixed(2));
        return row;
      }),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Add taxes table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Tax", "Percentage"]],
      body: taxes.map((tax) => [tax.name, tax.percentage.toString()]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    let currentY = finalY;

    doc.text("Subtotal:", 140, currentY);
    doc.text(subtotal.toFixed(2), 170, currentY, { align: "right" });

    taxes.forEach((tax, index) => {
      currentY += 10;
      doc.text(`${tax.name} (${tax.percentage}%):`, 140, currentY);
      doc.text((subtotal * (tax.percentage / 100)).toFixed(2), 170, currentY, {
        align: "right",
      });
    });

    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, currentY);
    doc.text(total.toFixed(2), 170, currentY, { align: "right" });

    // Add notes after totals if they exist
    if (notes) {
      const notesY = (doc as any).lastAutoTable.finalY + 40;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Notes:", 20, notesY);
      doc.text(notes, 20, notesY + 10, {
        maxWidth: 170,
      });
    }

    // Save the PDF
    doc.save("invoice.pdf");
  };

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between items-center mb-6 sticky top-0 z-50 bg-background px-4 py-4">
        <Link
          href="/invoices"
          className="flex items-center text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="md:block hidden">Back to Invoices</span>
        </Link>
        <h1 className="text-xl font-semibold ml-6 md:block hidden">
          {uuid ? "Edit Invoice" : "Create Invoice"}
        </h1>
        <div className="flex gap-2">
          {!uuid && (
            <Button className="flex-1" variant="outline">
              Save Draft
            </Button>
          )}
          <Button className="flex-1" onClick={generatePDF}>
            {uuid ? "Save" : "Create"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Left side - Form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Invoice Details</h2>

            {/* Invoice Number */}
            <div className="mb-6">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV2398-08-087"
              />
            </div>

            {/* Client Section */}
            <div className="mb-6">
              <Label className="mb-2">Client</Label>
              <ClientSelector
                clients={data?.clients || []}
                onClientSelect={setSelectedClient}
              />
            </div>

            {/* Issue Date and Due Date side by side */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Issue Date */}
              <div>
                <Label>Issue Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !issueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {issueDate ? (
                        format(issueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={issueDate}
                      onSelect={setIssueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due Date */}
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-6">
              <Label>Payment Terms</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              >
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_45">Net 45</option>
                <option value="net_60">Net 60</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Products Card */}
          <Label className="">Product</Label>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <ProductSelector
                    products={data?.products || []}
                    onProductSelect={(product) => {
                      const newItems = [...items];
                      const discountMultiplier = (100 - item.discount) / 100;
                      newItems[index] = {
                        ...item,
                        description: product.name,
                        rate: product.price || 0,
                        amount:
                          (product.price || 0) *
                          item.quantity *
                          discountMultiplier,
                      };
                      setItems(newItems);
                    }}
                  />
                </div>
                <Input
                  type="number"
                  className="w-20"
                  value={item.quantity}
                  onChange={(e) => {
                    const quantity = Number(e.target.value);
                    const discountMultiplier = (100 - item.discount) / 100;
                    const newItems = [...items];
                    newItems[index] = {
                      ...item,
                      quantity,
                      amount: quantity * item.rate * discountMultiplier,
                    };
                    setItems(newItems);
                  }}
                />
                <Input
                  type="number"
                  className="w-24"
                  value={item.rate}
                  onChange={(e) => {
                    const rate = Number(e.target.value);
                    const discountMultiplier = (100 - item.discount) / 100;
                    const newItems = [...items];
                    newItems[index] = {
                      ...item,
                      rate,
                      amount: item.quantity * rate * discountMultiplier,
                    };
                    setItems(newItems);
                  }}
                />
                <div className="flex items-center gap-2 w-32">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount}
                    onChange={(e) => {
                      const discount = Number(e.target.value);
                      const discountMultiplier = (100 - discount) / 100;
                      const newItems = [...items];
                      newItems[index] = {
                        ...item,
                        discount,
                        amount: item.quantity * item.rate * discountMultiplier,
                      };
                      setItems(newItems);
                    }}
                  />
                  <span className="text-sm">%</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Line
            </Button>
          </div>

          {/* Tax Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Taxes</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setTaxes([...taxes, { name: "Tax", percentage: 0 }])
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tax
              </Button>
            </div>
            {taxes.map((tax, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Input
                  className="flex-1"
                  placeholder="Tax name"
                  value={tax.name}
                  onChange={(e) => {
                    const newTaxes = [...taxes];
                    newTaxes[index] = { ...tax, name: e.target.value };
                    setTaxes(newTaxes);
                  }}
                />
                <div className="flex items-center gap-2 w-32">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tax.percentage}
                    onChange={(e) => {
                      const newTaxes = [...taxes];
                      newTaxes[index] = {
                        ...tax,
                        percentage: Number(e.target.value),
                      };
                      setTaxes(newTaxes);
                    }}
                  />
                  <span className="text-sm">%</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTaxes(taxes.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Notes Section - Add this after the Products Card */}

          <h2 className="text-lg font-medium mb-4">Notes</h2>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or payment instructions..."
            rows={4}
          />
        </div>

        {/* Right side - Preview */}
        <div>
          <Card className="p-6 bg-gray-50 border-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Preview</h2>
              <div className="flex gap-2">
                <Button
                  variant={activeView === "pdf" ? "default" : "outline"}
                  onClick={() => setActiveView("pdf")}
                  size="sm"
                >
                  PDF
                </Button>
              </div>
            </div>

            {/* Preview Content based on activeView */}
            {activeView === "pdf" && (
              <div className="space-y-4">
                <div className="border rounded-lg p-6 bg-white border-none">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">{invoiceNumber}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Issue date</p>
                        <p>
                          {issueDate
                            ? format(issueDate, "d MMMM yyyy")
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Due date</p>
                        <p>{date ? format(date, "d MMMM yyyy") : "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Terms</p>
                        <p>{getReadablePaymentTerms(paymentTerms)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-6">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">DESCRIPTION</th>
                        <th className="py-2 text-right">QTY</th>
                        <th className="py-2 text-right">UNIT PRICE</th>
                        {hasDiscounts && (
                          <th className="py-2 text-right">DISCOUNT</th>
                        )}
                        <th className="py-2 text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2">{item.description}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">{item.rate}</td>
                          {hasDiscounts && (
                            <td className="py-2 text-right">
                              {item.discount > 0 ? `${item.discount}%` : "-"}
                            </td>
                          )}
                          <td className="py-2 text-right">{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>{subtotal.toFixed(2)}</span>
                    </div>
                    {taxes.map((tax, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <span>
                          {tax.name} ({tax.percentage}%)
                        </span>
                        <span>
                          {(subtotal * (tax.percentage / 100)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Add Notes to Preview */}
                  {notes && (
                    <div className="border-t mt-4 pt-4">
                      <p className="text-sm text-gray-600 mb-2">Notes</p>
                      <p className="whitespace-pre-wrap">{notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
