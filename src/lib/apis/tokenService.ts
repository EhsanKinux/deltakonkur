import axios from "axios";
import { authStore } from "@/lib/store/authStore";
import { BASE_API_URL } from "@/lib/variables/variables";

interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (error?: unknown) => void;
}

class TokenService {
  private static instance: TokenService;
  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;
    const { refreshToken, username, password } = authStore.getState();

    try {
      if (!refreshToken || !username || !password) {
        throw new Error("Missing refresh token or credentials");
      }

      // Try to refresh using refresh token first
      try {
        const response = await axios.post(`${BASE_API_URL}api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        authStore.getState().setTokens(access, refreshToken);
        this.processQueue(null, access);
        return access;
      } catch (refreshError) {
        // If refresh token fails, try to login again
        const loginResponse = await axios.post(
          `${BASE_API_URL}api/auth/login/`,
          {
            username,
            password,
          }
        );

        const { access, refresh } = loginResponse.data;
        authStore.getState().setTokens(access, refresh);
        this.processQueue(null, access);
        return access;
      }
    } catch (error) {
      this.processQueue(error, null);
      authStore.getState().clearAuth();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  public isTokenExpired(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token expires in the next 5 minutes
      return payload.exp && payload.exp < currentTime + 300;
    } catch (error) {
      return true;
    }
  }

  public async getValidToken(): Promise<string | null> {
    const { accessToken } = authStore.getState();

    if (!accessToken) {
      return null;
    }

    if (this.isTokenExpired(accessToken)) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        return null;
      }
    }

    return accessToken;
  }
}

export default TokenService.getInstance();
