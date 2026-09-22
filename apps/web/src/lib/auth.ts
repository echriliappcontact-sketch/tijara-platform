export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function setUser(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStore() {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem("store");
  return s ? JSON.parse(s) : null;
}

export function setStore(store: any) {
  localStorage.setItem("store", JSON.stringify(store));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("store");
  window.location.href = "/login";
}

export function isLoggedIn() {
  return !!getToken();
}
