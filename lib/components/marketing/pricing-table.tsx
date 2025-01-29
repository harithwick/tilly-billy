import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";

const invoices = [
  {
    feature: "INV001",
    free: "Paid",
    pro: "$250.00",
  },
  {
    feature: "INV002",
    free: "Pending",
    pro: "$150.00",
  },
  {
    feature: "INV003",
    free: "Unpaid",
    pro: "$350.00",
  },
  {
    feature: "INV004",
    free: "Paid",
    pro: "$450.00",
  },
  {
    feature: "INV005",
    free: "Paid",
    pro: "$550.00",
  },
  {
    feature: "INV006",
    free: "Pending",
    pro: "$200.00",
  },
  {
    feature: "INV007",
    free: "Unpaid",
    pro: "$300.00",
  },
];

export function PricingTable() {
  return (
    <Table className="max-w-5xl py-4 mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead>sdfsdf</TableHead>
          <TableHead>sdf</TableHead>
          <TableHead className="text-lg xl:text-xl 2xl:text-2xl uppercase  font-normal items-center">
            Pro
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((feature) => (
          <TableRow key={feature.feature}>
            <TableCell className="font-medium">{feature.feature}</TableCell>
            <TableCell>{feature.free}</TableCell>
            <TableCell>{feature.pro}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
