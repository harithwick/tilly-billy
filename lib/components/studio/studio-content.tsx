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
import {
  Client,
  Organization,
  ClientAddress,
  AdjustmentItem,
} from "@/lib/types";
// Update the TaxItem type to become AdjustmentItem

export default function StudioContent({ uuid }: { uuid?: string }) {
  const [date, setDate] = useState<Date>();
  const [items, setItems] = useState<
    Array<{
      id: string | null;
      description: string;
      quantity: number;
      rate: number;
      discount: number;
      amount: number;
    }>
  >([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");
  const { data, loading, error } = useStudio(invoiceId || null);
  const [activeView, setActiveView] = useState<"invoice" | "pdf">("pdf");
  const [invoiceNumber, setInvoiceNumber] = useState("INV2398-08-087");
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("due_on_receipt");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [adjustments, setAdjustments] = useState<AdjustmentItem[]>([
    { name: "Tax", value: 10, isPercentage: true },
  ]);
  const [terms, setTerms] = useState("");

  useEffect(() => {
    if (data?.invoice) {
      // Populate form with invoice data
      setOrganization(data.organization);
      setDate(new Date(data.invoice.issueDate));
      // setSelectedClient(data.invoice.clientId);
      setItems(
        data.invoice.items.map((item) => ({
          id: item.id,
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
      {
        id: null,
        description: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const hasDiscounts = items.some((item) => item.discount > 0);

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const totalAdjustments = adjustments.reduce((acc, adjustment) => {
    return (
      acc +
      (adjustment.isPercentage
        ? subtotal * (adjustment.value / 100)
        : adjustment.value)
    );
  }, 0);
  const total = subtotal + totalAdjustments;

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

    // Add organization details
    if (organization) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(organization.name, 20, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let yPos = 30;

      if (organization.email) {
        doc.text(organization.email, 20, yPos);
        yPos += 7;
      }
    }

    // Add "INVOICE" text and invoice number
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 20);
    doc.setFontSize(12);
    doc.text(invoiceNumber, 140, 30);

    // Calculate the starting Y position based on organization and client details
    let startY = organization ? 80 : 40;

    // Add client details
    if (selectedClient) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Bill To:", 20, startY);
      doc.setFont("helvetica", "bold");
      doc.text(selectedClient.name, 20, startY + 10);
      doc.setFont("helvetica", "normal");
      if (selectedClient.company) {
        doc.text(selectedClient.company, 20, startY + 17);
      }
      if (selectedClient.address) {
        // doc.text(selectedClient.address, 20, selectedClient.company ? 59 : 52);
      }
      if (selectedClient.email) {
        doc.text(selectedClient.email, 20, startY + 24);
      }
      if (selectedClient.phone) {
        doc.text(selectedClient.phone, 20, startY + 31);
      }

      // Adjust startY if client has details
      startY = startY + (selectedClient.phone ? 50 : 40);

      // Add issue date and payment terms
      doc.text("Issue date:", 120, startY);
      doc.text(
        issueDate ? format(issueDate, "d MMMM yyyy") : "Not set",
        160,
        startY
      );
      doc.text("Payment Terms:", 120, startY + 10);
      doc.text(getReadablePaymentTerms(paymentTerms), 160, startY + 10);

      // Update the items table starting position
      autoTable(doc, {
        startY: startY + 20,
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
    }

    // Add adjustments table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Adjustment", "Value"]],
      body: adjustments.map((adjustment) => [
        adjustment.name,
        adjustment.value.toString(),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    let currentY = finalY;

    doc.text("Subtotal:", 140, currentY);
    doc.text(subtotal.toFixed(2), 170, currentY, { align: "right" });

    adjustments.forEach((adjustment, index) => {
      currentY += 10;
      doc.text(`${adjustment.name} (${adjustment.value}%):`, 140, currentY);
      doc.text(
        (subtotal * (adjustment.value / 100)).toFixed(2),
        170,
        currentY,
        {
          align: "right",
        }
      );
    });

    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, currentY);
    doc.text(total.toFixed(2), 170, currentY, { align: "right" });

    // Add notes after totals if they exist
    if (notes || terms) {
      const notesY = (doc as any).lastAutoTable.finalY + 40;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Notes:", 20, notesY);
      doc.text(notes, 20, notesY + 10, {
        maxWidth: 170,
      });
    }

    if (terms) {
      const termsY = (doc as any).lastAutoTable.finalY + (notes ? 60 : 40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Terms & Conditions:", 20, termsY);
      doc.text(terms, 20, termsY + 10, {
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
          href="/dashboard/invoices"
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
        <div className="space-y-6 mb-24">
          <div>
            <h2 className="text-lg font-medium mb-4">Invoice Details</h2>

            {/* Invoice Number */}
            <div className="mb-6">
              <Label htmlFor="invoiceNumber">Invoice Number*</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV2398-08-087"
              />
            </div>

            {/* Client Section */}
            <div className="mb-6">
              <Label className="mb-2">Client*</Label>
              <ClientSelector
                clients={data?.clients || []}
                onClientSelect={(client) => {
                  // setSelectedClient(client);
                }}
              />
            </div>

            {/* Issue Date and Due Date side by side */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Issue Date */}
              <div>
                <Label>Issue Date*</Label>
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
                      onSelect={(date) => setIssueDate(date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due Date */}
              <div>
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
          </div>

          {/* Products Card */}
          <h2 className="text-lg font-medium mb-4 mt-4">Products</h2>
          <div className="space-y-4">
            {/* Add column headers */}
            <div className="hidden md:flex gap-4 items-center px-2">
              <div className="flex-1">
                <Label>Item</Label>
              </div>
              <div className="flex gap-2 w-auto">
                <div className="w-20">
                  <Label>Qty</Label>
                </div>
                <div className="w-24">
                  <Label>Price</Label>
                </div>
                <div className="w-32">
                  <Label>Discount</Label>
                </div>
                <div className="w-9"></div> {/* Space for delete button */}
              </div>
            </div>

            {/* Mobile headers - shown above each input on mobile */}
            <style jsx global>{`
              @media (max-width: 768px) {
                .mobile-label {
                  font-size: 0.875rem;
                  color: var(--muted-foreground);
                  margin-bottom: 0.25rem;
                }
              }
            `}</style>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 items-start"
              >
                <div className="flex-1 w-full">
                  <div className="md:hidden mobile-label">Item</div>
                  <ProductSelector
                    products={data?.products || []}
                    selectedProductId={item.id}
                    onProductSelect={(product) => {
                      const newItems = [...items];
                      const discountMultiplier = (100 - item.discount) / 100;
                      newItems[index] = {
                        ...item,
                        id: product.id,
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
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <div className="w-full md:w-20">
                    <div className="md:hidden mobile-label">Quantity</div>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Qty"
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
                  </div>
                  <div className="w-full md:w-24">
                    <div className="md:hidden mobile-label">Price</div>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Rate"
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
                  </div>
                  <div className="w-full md:w-32">
                    <div className="md:hidden mobile-label">Discount</div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Discount"
                        value={item.discount}
                        onChange={(e) => {
                          const discount = Number(e.target.value);
                          const discountMultiplier = (100 - discount) / 100;
                          const newItems = [...items];
                          newItems[index] = {
                            ...item,
                            discount,
                            amount:
                              item.quantity * item.rate * discountMultiplier,
                          };
                          setItems(newItems);
                        }}
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2 md:mt-0"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="link" className="w-full" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Line
            </Button>
          </div>

          {/* Adjustments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fees & Adjustments</Label>
              <Button
                variant="link"
                size="sm"
                onClick={() =>
                  setAdjustments([
                    ...adjustments,
                    adjustments.length === 0
                      ? { name: "Tax", value: 10, isPercentage: true }
                      : { name: "Adjustment", value: 0, isPercentage: true },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Adjustment
              </Button>
            </div>
            {adjustments.map((adjustment, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Input
                  className="flex-1"
                  placeholder="Adjustment name"
                  value={adjustment.name}
                  onChange={(e) => {
                    const newAdjustments = [...adjustments];
                    newAdjustments[index] = {
                      ...adjustment,
                      name: e.target.value,
                    };
                    setAdjustments(newAdjustments);
                  }}
                />
                <div className="flex items-center gap-2 w-40">
                  <Input
                    type="number"
                    min="0"
                    value={adjustment.value}
                    onChange={(e) => {
                      const newAdjustments = [...adjustments];
                      newAdjustments[index] = {
                        ...adjustment,
                        value: Number(e.target.value),
                      };
                      setAdjustments(newAdjustments);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-12"
                    onClick={() => {
                      const newAdjustments = [...adjustments];
                      newAdjustments[index] = {
                        ...adjustment,
                        isPercentage: !adjustment.isPercentage,
                      };
                      setAdjustments(newAdjustments);
                    }}
                  >
                    {adjustment.isPercentage ? "%" : "$"}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setAdjustments(adjustments.filter((_, i) => i !== index))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <h2 className="text-lg font-medium mb-4">Notes</h2>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or payment instructions..."
            rows={4}
          />

          {/* Terms Section */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Terms & Conditions</h2>
            <Textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Add your terms and conditions..."
              rows={4}
            />
          </div>
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
              <div className="space-y-4" style={{ zoom: 0.75 }}>
                <div className="border rounded-lg p-6 bg-white border-none">
                  <div className="mb-6">
                    {/* Organization and Invoice Header */}
                    <div className="flex justify-between mb-8">
                      {/* Organization Details */}
                      {organization && (
                        <div>
                          <h2 className="text-xl font-bold mb-2">
                            {organization.name}
                          </h2>
                          <div className="text-sm text-gray-600">
                            {organization.email && <p>{organization.email}</p>}
                          </div>
                        </div>
                      )}
                      {/* Invoice Title and Number */}
                      <div className="text-right">
                        <h3 className="text-2xl font-bold mb-2">INVOICE</h3>
                        <p className="text-lg">{invoiceNumber}</p>
                      </div>
                    </div>

                    {/* Issue Date and Payment Terms */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <p className="text-sm text-gray-600">Issue Date</p>
                        <p>
                          {issueDate
                            ? format(issueDate, "d MMMM yyyy")
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Terms</p>
                        <p>{getReadablePaymentTerms(paymentTerms)}</p>
                      </div>
                    </div>

                    {/* Client Details */}
                    <div className="flex justify-end mb-8">
                      {selectedClient && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Bill To:</p>
                          <p className="font-medium">{selectedClient.name}</p>
                          {selectedClient.company && (
                            <p className="text-sm">{selectedClient.company}</p>
                          )}
                          {selectedClient.address && (
                            <p className="text-sm">
                              {selectedClient.address.street}
                            </p>
                          )}
                          {selectedClient.email && (
                            <p className="text-sm">{selectedClient.email}</p>
                          )}
                          {selectedClient.phone && (
                            <p className="text-sm">{selectedClient.phone}</p>
                          )}
                        </div>
                      )}
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
                    <div className="border-t pt-4 ml-auto max-w-xs">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)}</span>
                      </div>
                      {adjustments.map((adjustment, index) => (
                        <div key={index} className="flex justify-between mb-2">
                          <span>
                            {adjustment.name}{" "}
                            {adjustment.isPercentage
                              ? `(${adjustment.value}%)`
                              : ""}
                          </span>
                          <span>
                            {adjustment.isPercentage
                              ? (subtotal * (adjustment.value / 100)).toFixed(2)
                              : adjustment.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Add Notes to Preview */}
                    {(notes || terms) && (
                      <div className="border-t mt-4 pt-4">
                        {notes && (
                          <>
                            <p className="text-sm text-gray-600 mb-2">Notes</p>
                            <p className="whitespace-pre-wrap mb-4">{notes}</p>
                          </>
                        )}
                        {terms && (
                          <>
                            <p className="text-sm text-gray-600 mb-2">Terms</p>
                            <p className="whitespace-pre-wrap">{terms}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
