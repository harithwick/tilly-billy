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

export default function StudioPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudioContent />
    </Suspense>
  );
}

function StudioContent() {
  const [date, setDate] = useState<Date>();
  const [items, setItems] = useState<
    Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>
  >([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("id");
  const { data, loading, error } = useStudio(invoiceId || null);

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
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link
          href="/invoices"
          className="flex items-center text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Link>
        <h1 className="text-2xl font-semibold ml-6">Create Invoice</h1>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left side - Form */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Invoice Details</h2>

            {/* People Section */}
            <div className="mb-6">
              <Label className="mb-2">People</Label>
              <ClientSelector
                clients={data?.clients || []}
                onClientSelect={setSelectedClient}
              />
            </div>

            {/* Subject */}
            <div className="mb-6">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Service per June 2023" />
            </div>

            {/* Due Date */}
            <div className="mb-6">
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

            {/* Currency */}
            <div className="mb-6">
              <Label>Currency</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="IDR">IDR - Indonesian Rupiah</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>

          {/* Products Card */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Product</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <ProductSelector
                      products={data?.products || []}
                      onProductSelect={(product) => {
                        const newItems = [...items];
                        newItems[index] = {
                          ...item,
                          description: product.name,
                          rate: product.price || 0,
                          amount: (product.price || 0) * item.quantity,
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
                      const newItems = [...items];
                      newItems[index] = {
                        ...item,
                        quantity,
                        amount: quantity * item.rate,
                      };
                      setItems(newItems);
                    }}
                  />
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
          </Card>
        </div>

        {/* Right side - Preview */}
        <div>
          <Card className="p-6 bg-gray-50 border-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Preview</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <span className="mr-2">PDF</span>
                </Button>
                <Button variant="outline">
                  <span className="mr-2">Email</span>
                </Button>
              </div>
            </div>

            {/* Invoice Preview Content */}
            <div className="border rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">INV2398-08-087</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Due date</p>
                    <p>{date ? format(date, "d MMMM yyyy") : "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p>Service per June 2023</p>
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
                    <th className="py-2 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{item.rate}</td>
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
                <div className="flex justify-between mb-2">
                  <span>Tax (10%)</span>
                  <span>{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
