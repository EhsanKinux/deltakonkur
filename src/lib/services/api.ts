import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse, PaginatedResponse, ApiError } from "@/types";
import { authStore } from "@/lib/store/authStore";

// =============================================================================
// API CONFIGURATION
// =============================================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  // =============================================================================
  // INTERCEPTORS
  // =============================================================================

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = authStore.getState().accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          authStore.getState().clearAuth();
        }
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  private handleApiError(error: unknown): ApiError {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; details?: Record<string, string[]> };
          status?: number;
        };
      };
      return {
        message: axiosError.response?.data?.message || "An error occurred",
        status: axiosError.response?.status || 0,
        details: axiosError.response?.data?.details,
      };
    }

    return {
      message: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }

  // =============================================================================
  // GENERIC HTTP METHODS
  // =============================================================================

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return {
      data: response.data,
      status: response.status,
    };
  }

  // =============================================================================
  // PAGINATED REQUESTS
  // =============================================================================

  async getPaginated<T = unknown>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  }

  // =============================================================================
  // FILE UPLOAD
  // =============================================================================

  async uploadFile<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return {
      data: response.data,
      status: response.status,
    };
  }

  // =============================================================================
  // DOWNLOAD FILE
  // =============================================================================

  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// =============================================================================
// API INSTANCE
// =============================================================================

export const apiService = new ApiService();

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

export const api = {
  get: apiService.get.bind(apiService),
  post: apiService.post.bind(apiService),
  put: apiService.put.bind(apiService),
  patch: apiService.patch.bind(apiService),
  delete: apiService.delete.bind(apiService),
  getPaginated: apiService.getPaginated.bind(apiService),
  uploadFile: apiService.uploadFile.bind(apiService),
  downloadFile: apiService.downloadFile.bind(apiService),
};

export default apiService;
