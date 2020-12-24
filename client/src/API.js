export async function listLogEntries() {
  const response = await fetch(`${process.env.API_URL}/api/routes`);
  return response.json();
}

export async function createLogEntry(entry) {
  const response = await fetch(`${process.env.API_URL}/api/routes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}