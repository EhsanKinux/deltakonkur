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
}

export const authStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  userRoles: Cookies.get("userRoles") ? JSON.parse(Cookies.get("userRoles") as string) : null,
  username: null,
  password: null,

  setCredentials: (username, password) => {
    set({ username, password });
  },

  setTokens: (access, refresh) => {
    Cookies.set("accessToken", access, { sameSite: "strict" });
    Cookies.set("refreshToken", refresh, { sameSite: "strict" });
    set({ accessToken: access, refreshToken: refresh });
  },

  setUserRoles: (roles) => {
    Cookies.set("userRoles", JSON.stringify(roles), { sameSite: "strict" });
    set({ userRoles: roles });
  },

  clearAuth: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRoles");
    set({ accessToken: null, refreshToken: null, userRoles: null, username: null, password: null });
  },
}));
