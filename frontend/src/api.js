// All API calls go through this module.

const BASE = '/api/tasks';

// Helper: check for HTTP errors and throw with the server's error message
const handleResponse = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res;
};

export const getTasks = async (status) => {
  const url = status ? `${BASE}?status=${status}` : BASE;
  const res = await handleResponse(await fetch(url));
  return res.json();
};

export const createTask = async ({ title, description }) => {
  const res = await handleResponse(
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
  );
  return res.json();
};

export const updateTask = async (id, updates) => {
  const res = await handleResponse(
    await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  );
  return res.json();
};

export const deleteTask = async (id) => {
  await handleResponse(await fetch(`${BASE}/${id}`, { method: 'DELETE' }));
};