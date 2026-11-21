// Small helper for talking to the Node.js / Express server.
// In development Vite forwards every "/api" request to http://localhost:4000
// (see vite.config.js), so the browser never needs the server's address.

const TOKEN_KEY = "sems_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(method, url, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Serveri nuk përgjigjet. A është startuar serveri?");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/");
      return;
    }
    const err = new Error(data?.error || `Gabim në server (${res.status})`);
    err.field = data?.field;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (url) => request("GET", url),
  post: (url, body) => request("POST", url, body),
  patch: (url, body) => request("PATCH", url, body),
  delete: (url) => request("DELETE", url),
};

// ---------- authentication ----------

export async function login(id, password) {
  const { token, user } = await api.post("/auth/login", { id, password });
  localStorage.setItem(TOKEN_KEY, token);
  return user;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    /* already logged out */
  }
  localStorage.removeItem(TOKEN_KEY);
}

// Returns the logged-in user, or null (e.g. after a page refresh with no session)
export async function getCurrentUser() {
  if (!getToken()) return null;
  try {
    const { user } = await api.get("/auth/me");
    return user;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}
