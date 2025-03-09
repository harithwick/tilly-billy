import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utilities";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

interface RecurringInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    frequency: string;
    startDate: Date;
    endDate?: Date;
  }) => void;
}

function getNextDates(
  startDate: Date,
  frequency: string,
  count: number = 5,
  endDate?: Date
): Date[] {
  if (!startDate || !frequency) return [];

  const dates: Date[] = [new Date(startDate)];
  let currentDate = startDate;

  for (let i = 1; i < count; i++) {
    switch (frequency) {
      case "DAILY":
        currentDate = addDays(currentDate, 1);
        break;
      case "WEEKLY":
        currentDate = addWeeks(currentDate, 1);
        break;
      case "FORTNIGHTLY":
        currentDate = addWeeks(currentDate, 2);
        break;
      case "MONTHLY":
        currentDate = addMonths(currentDate, 1);
        break;
      case "QUARTERLY":
        currentDate = addMonths(currentDate, 3);
        break;
      case "YEARLY":
        currentDate = addYears(currentDate, 1);
        break;
      default:
        return dates;
    }

    if (endDate && currentDate > endDate) {
      break;
    }

    dates.push(new Date(currentDate));
  }

  return dates;
}

function hasMoreDates(
  lastShownDate: Date,
  frequency: string,
  endDate?: Date
): boolean {
  if (!endDate) return true;

  let nextDate;
  switch (frequency) {
    case "DAILY":
      nextDate = addDays(lastShownDate, 1);
      break;
    case "WEEKLY":
      nextDate = addWeeks(lastShownDate, 1);
      break;
    case "FORTNIGHTLY":
      nextDate = addWeeks(lastShownDate, 2);
      break;
    case "MONTHLY":
      nextDate = addMonths(lastShownDate, 1);
      break;
    case "QUARTERLY":
      nextDate = addMonths(lastShownDate, 3);
      break;
    case "YEARLY":
      nextDate = addYears(lastShownDate, 1);
      break;
    default:
      return false;
  }
  return nextDate <= endDate;
}

export function RecurringInvoiceModal({
  open,
  onOpenChange,
  onSubmit,
}: RecurringInvoiceModalProps) {
  const [frequency, setFrequency] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upcomingDates = useMemo(() => {
    if (!startDate || !frequency) return [];
    return getNextDates(startDate, frequency, 5, endDate);
  }, [startDate, frequency, endDate]);

  const showMoreDatesMessage = useMemo(() => {
    if (upcomingDates.length === 0) return false;
    const lastDate = upcomingDates[upcomingDates.length - 1];
    return hasMoreDates(lastDate, frequency, endDate);
  }, [upcomingDates, frequency, endDate]);

  const handleSubmit = async () => {
    if (!frequency || !startDate || upcomingDates.length === 0) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        frequency,
        startDate,
        endDate,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating recurring invoice:", error);
      // You could add error handling UI here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (isSubmitting && !newOpen) return;
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Up Recurring Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="FORTNIGHTLY">Fortnightly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 pt-4">
            <Label>Preview of Upcoming Dates</Label>
            <div className="rounded-md border p-4 space-y-2">
              {!frequency || !startDate ? (
                <p className="text-sm text-muted-foreground">
                  Select a frequency and start date to see upcoming invoice
                  dates
                </p>
              ) : upcomingDates.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    The following invoices will be created:
                  </p>
                  <ul className="space-y-1">
                    {upcomingDates.map((date, index) => (
                      <li key={index} className="text-sm">
                        {format(date, "PPP")}
                      </li>
                    ))}
                  </ul>
                  {showMoreDatesMessage && (
                    <>
                      {!endDate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          ... and will continue indefinitely
                        </p>
                      )}
                      {endDate && (
                        <p className="text-sm text-muted-foreground mt-2">
                          ... until {format(endDate, "PPP")}
                        </p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming dates available. Please adjust your date range.
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !frequency ||
              !startDate ||
              upcomingDates.length === 0 ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
