export interface AuthUser {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const AUTH_STATE_CHANGED = "auth-state-changed";

let cachedToken: string | null | undefined;
let cachedUserValue: string | null | undefined;
let cachedAuthState: AuthState | undefined;

function parseStoredUser(value: string | null): AuthUser | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthState(): AuthState {
  const token = localStorage.getItem("token");
  const userValue = localStorage.getItem("user");

  if (
    cachedAuthState &&
    cachedToken === token &&
    cachedUserValue === userValue
  ) {
    return cachedAuthState;
  }

  const user = parseStoredUser(userValue);

  cachedToken = token;
  cachedUserValue = userValue;
  cachedAuthState = {
    token,
    user,
    isAuthenticated: Boolean(token && user),
  };

  return cachedAuthState;
}

export function emitAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
}

export function setAuthSession(token: string, user: AuthUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  emitAuthStateChanged();
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  emitAuthStateChanged();
}

export function subscribeToAuthState(callback: () => void) {
  window.addEventListener(AUTH_STATE_CHANGED, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_STATE_CHANGED, callback);
    window.removeEventListener("storage", callback);
  };
}
