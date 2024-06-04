import { BASE_API_URL } from "../variables/variables";

export async function fetchInstance(url: string, options?: RequestInit) {
  const response = await fetch(`${BASE_API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Network Error!");
  }
  return response.json();
}
