export async function getOrganizationSettings() {
  const response = await fetch("/api/dashboard/settings");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch organization settings");
  }

  return response.json();
}

export async function updateOrganizationSettings(data: {
  uuid: string;
  name?: string;
  email?: string;
  timezone?: string;
  invPrefix?: string;
}) {
  const response = await fetch("/api/dashboard/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update organization settings");
  }

  return response.json();
}
