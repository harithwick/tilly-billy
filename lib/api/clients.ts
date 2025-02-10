import { Client } from "@/lib/types/client";

export async function createClient(data: Partial<Client>): Promise<Client> {
  const response = await fetch("/api/dashboard/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create client");
  }

  return response.json();
}

export async function updateClient(
  id: string,
  data: Partial<Client>
): Promise<Client> {
  const response = await fetch(`/api/dashboard/clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update client");
  }

  return response.json();
}

export async function deleteClient(id: string): Promise<void> {
  const response = await fetch(`/api/dashboard/clients/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete client");
  }
}

export async function archiveClient(id: string): Promise<void> {
  const response = await fetch(`/api/dashboard/client/${id}/archive`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to archive client");
  }
}

export async function unarchiveClient(id: string): Promise<void> {
  const response = await fetch(`/api/dashboard/client/${id}/unarchive`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to unarchive client");
  }
}
