import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userRoles: number[] | null;
  username: string | null;
  password: string | null;
  setCredentials: (username: string, password: string) => void;
  setTokens: (access: string, refresh: string) => void;
  setUserRoles: (roles: number[]) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  validateToken: () => boolean;
}

export const authStore = create<AuthState>((set, get) => ({
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  userRoles: Cookies.get("userRoles")
    ? JSON.parse(Cookies.get("userRoles") as string)
    : null,
  username: null,
  password: null,

  setCredentials: (username, password) => {
    set({ username, password });
  },

  setTokens: (access, refresh) => {
    // Set cookies with proper expiration and security options
    Cookies.set("accessToken", access, {
      sameSite: "strict",
      secure: window.location.protocol === "https:",
      expires: 1, // 1 day
    });
    Cookies.set("refreshToken", refresh, {
      sameSite: "strict",
      secure: window.location.protocol === "https:",
      expires: 7, // 7 days
    });
    set({ accessToken: access, refreshToken: refresh });
  },

  setUserRoles: (roles) => {
    Cookies.set("userRoles", JSON.stringify(roles), {
      sameSite: "strict",
      secure: window.location.protocol === "https:",
      expires: 7, // 7 days
    });
    set({ userRoles: roles });
  },

  clearAuth: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRoles");
    set({
      accessToken: null,
      refreshToken: null,
      userRoles: null,
      username: null,
      password: null,
    });
  },

  isAuthenticated: () => {
    const { accessToken, refreshToken } = get();
    return !!(accessToken && refreshToken);
  },

  validateToken: () => {
    const { accessToken } = get();
    if (!accessToken) return false;

    try {
      // Basic token validation - check if it's a valid JWT format
      const parts = accessToken.split(".");
      if (parts.length !== 3) return false;

      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },
}));
