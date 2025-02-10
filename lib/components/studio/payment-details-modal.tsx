import { useState, useEffect } from "react";
import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/lib/components/ui/radio-group";
import { Loader2 } from "lucide-react";

export type PaymentDetail = {
  id: string;
  type: "link" | "details";
  name: string;
  value: string;
};

type PaymentDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (paymentDetail: Omit<PaymentDetail, "id">) => Promise<boolean>;
  editingPaymentDetail?: {
    id: string;
    label: string;
    type: "link" | "details";
    details: string;
  };
};

export function PaymentDetailsModal({
  open,
  onClose,
  onSave,
  editingPaymentDetail,
}: PaymentDetailsModalProps) {
  const [type, setType] = useState<"link" | "details">("link");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form when editing
  useEffect(() => {
    if (editingPaymentDetail && open) {
      setType(editingPaymentDetail.type);
      setName(editingPaymentDetail.label);
      setValue(editingPaymentDetail.details);
    }
  }, [editingPaymentDetail, open]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    // Reset error state
    setError(null);

    // Validate required fields
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!value.trim()) {
      setError(
        type === "link"
          ? "Payment link is required"
          : "Account details are required"
      );
      return;
    }

    // Validate URL if type is link
    if (type === "link" && !validateUrl(value)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    const success = await onSave({ type, name, value });
    setIsLoading(false);

    if (success) {
      setType("link");
      setName("");
      setValue("");
      setError(null);
      onClose();
    }
  };

  const handleClose = () => {
    setError(null);
    setType("link");
    setName("");
    setValue("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingPaymentDetail
              ? "Edit Payment Details"
              : "Add Payment Details"}
          </DialogTitle>
          <DialogDescription>
            {editingPaymentDetail
              ? "Edit your payment details below."
              : "Add payment details to your invoice. This is how your clients will pay you."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup
            value={type}
            onValueChange={(value) => {
              setType(value as "link" | "details");
              setError(null);
              setValue("");
            }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="link" id="link" />
              <Label htmlFor="link">Payment Link</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="details" id="details" />
              <Label htmlFor="details">Bank Details</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="e.g., PayPal or Bank Transfer"
              className={error && !name.trim() ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              {type === "link" ? "Payment Link" : "Account Details"}
            </Label>
            {type === "link" ? (
              <Input
                id="value"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder="https://..."
                className={
                  error &&
                  type === "link" &&
                  (!value.trim() || !validateUrl(value))
                    ? "border-destructive"
                    : ""
                }
              />
            ) : (
              <Textarea
                id="value"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder="Enter bank account details..."
                rows={4}
                className={error && !value.trim() ? "border-destructive" : ""}
              />
            )}
          </div>

          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
