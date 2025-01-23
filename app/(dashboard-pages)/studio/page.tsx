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
    <div>
      <Header />
      <div className="mx-auto max-w-[850px] p-8 mt-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-12">
          <div>
            <Input
              className="text-3xl font-bold border-0 p-0 max-w-[300px]"
              placeholder="Your Company"
            />
            <Textarea
              className="text-gray-600 mt-2 border-0 p-0 resize-none"
              placeholder="123 Business Street&#10;City, State 12345&#10;contact@company.com"
              rows={3}
            />
          </div>
          <div className="text-right">
            <Input
              className="text-4xl font-bold border-0 p-0 max-w-[300px] placeholder:text-right mb-4"
              placeholder="INVOICE"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-600">Invoice #:</span>
                <Input className="w-32 text-right" placeholder="INV-001" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-600">Date:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-32 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
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
          </div>
        </div>

        {/* Bill To Section */}
        <div className="mb-12">
          <h2 className="text-gray-600 font-medium mb-2">Bill To:</h2>
          <ClientSelector
            clients={data?.clients || []}
            onClientSelect={(client) => {
              setSelectedClient(client);
            }}
          />
          {selectedClient && (
            <div className="mt-4 text-gray-600">
              <p className="font-medium">{selectedClient.company}</p>
              <p className="whitespace-pre-line">{selectedClient.address}</p>
              <p>{selectedClient.email}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Rate</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <ProductSelector
                      products={data?.products || []}
                      onProductSelect={(product) => {
                        const newItems = [...items];
                        // newItems[index] = {
                        //   description: product.name,
                        //   quantity: 1,
                        //   rate: product.price,
                        //   amount: product.price,
                        // };
                        setItems(newItems);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      type="number"
                      className="w-24 text-right"
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
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      type="number"
                      className="w-24 text-right"
                      value={item.rate}
                      onChange={(e) => {
                        const rate = Number(e.target.value);
                        const newItems = [...items];
                        newItems[index] = {
                          ...item,
                          rate,
                          amount: item.quantity * rate,
                        };
                        setItems(newItems);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24 text-right">
                      ${item.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="text-gray-800 font-bold">Total:</span>
              <span className="text-gray-800 font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-gray-600 mb-2">Notes:</Label>
          <Textarea
            placeholder="Thank you for your business!"
            className="w-full resize-none"
            rows={3}
          />
        </div>
      </div>
      <ConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
        title="Are you sure?"
        description="This action cannot be undone."
        actionLabel="Delete"
        variant="destructive"
        loading={loadingModal}
      />
    </div>
  );
}
