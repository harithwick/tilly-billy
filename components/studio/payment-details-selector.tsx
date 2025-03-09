import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils/utilities";
import { useState } from "react";
import { PaymentDetail } from "./payment-details-modal";

type PaymentDetailsSelectorProps = {
  paymentDetails?: PaymentDetail[];
  selectedPaymentDetail: string;
  onPaymentDetailSelect: (id: string) => void;
  onAddNew: () => void;
};

export function PaymentDetailsSelector({
  paymentDetails = [],
  selectedPaymentDetail,
  onPaymentDetailSelect,
  onAddNew,
}: PaymentDetailsSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedDetail = paymentDetails.find(
    (d) => d.id === selectedPaymentDetail
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedDetail?.name || "Select payment details..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search payment details..." />
          <CommandEmpty>No payment details found.</CommandEmpty>
          <CommandGroup>
            {paymentDetails.map((detail) => (
              <CommandItem
                key={detail.id}
                value={detail.name}
                onSelect={() => {
                  onPaymentDetailSelect(detail.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedPaymentDetail === detail.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {detail.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                onAddNew();
                setOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Payment Details
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
