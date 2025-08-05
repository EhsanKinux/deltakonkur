import api from "@/lib/apis/global-interceptor";
import { AxiosInstance } from "axios";

// Extend axios instance type
interface ExtendedAxiosInstance extends AxiosInstance {
  getPaginated: <T>(
    url: string,
    params?: Record<string, unknown>
  ) => Promise<T>;
}

// Cast api to extended type and add the method
const extendedApi = api as ExtendedAxiosInstance;

extendedApi.getPaginated = async function <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await this.get(url, { params });
  return response.data;
};

export { extendedApi as api };
