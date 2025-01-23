import { Invoice } from "@/lib/types";

export async function createInvoice(
  data: Partial<Invoice> & { activeOrgUuid: string }
): Promise<Invoice> {
  const response = await fetch("/api/dashboard/invoices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create invoice");
  }

  return response.json();
}

export async function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  const response = await fetch(`/api/dashboard/invoices/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update invoice");
  }

  return response.json();
}

export async function deleteInvoice(id: string): Promise<void> {
  const response = await fetch(`/api/dashboard/invoices/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete invoice");
  }
}
