import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userRole: number | null;
  setTokens: (access: string, refresh: string) => void;
  setUserRole: (role: number) => void;
  clearAuth: () => void;
}

export const authStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  userRole: Cookies.get("userRole") ? parseInt(Cookies.get("userRole") as string, 10) : null,
  setTokens: (access, refresh) => {
    Cookies.set("accessToken", access, { secure: true, sameSite: "strict" });
    Cookies.set("refreshToken", refresh, { secure: true, sameSite: "strict" });
    set({ accessToken: access, refreshToken: refresh });
  },
  setUserRole: (role) => {
    Cookies.set("userRole", role.toString(), { secure: true, sameSite: "strict" });
    set({ userRole: role });
  },
  clearAuth: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    set({ accessToken: null, refreshToken: null, userRole: null });
  },
}));
