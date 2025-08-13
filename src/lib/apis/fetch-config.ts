import { authStore } from "../store/authStore";
import { BASE_API_URL } from "../variables/variables";
import tokenService from "./tokenService";
import navigationService from "../services/navigationService";

export async function fetchInstance(url: string, options?: RequestInit) {
  try {
    const validToken = await tokenService.getValidToken();

    if (!validToken) {
      throw new Error("No valid authentication token");
    }

    return await fetch(`${BASE_API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
        ...options?.headers,
      },
    }).then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token and retry
          try {
            const newToken = await tokenService.refreshAccessToken();
            if (newToken) {
              // Retry the request with new token
              return await fetch(`${BASE_API_URL}${url}`, {
                ...options,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${newToken}`,
                  ...options?.headers,
                },
              }).then(async (retryResponse) => {
                if (!retryResponse.ok) {
                  const message = await retryResponse.text();
                  throw new Error(message || "Network Error!");
                }
                if (retryResponse.status === 204) {
                  return null;
                }
                return retryResponse.json();
              });
            }
          } catch (refreshError) {
            // If refresh fails, clear auth and throw error
            authStore.getState().clearAuth();
            throw new Error("Authentication failed");
          }
        }

        const message = await response.text();
        throw new Error(message || "Network Error!");
      }
      if (response.status === 204) {
        return null;
      }
      return response.json();
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication failed") {
      // Use navigation service instead of window.location
      navigationService.navigateToLogin();
    }
    throw error;
  }
}
