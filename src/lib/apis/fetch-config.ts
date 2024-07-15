import { BASE_API_URL } from "../variables/variables";

export async function fetchInstance(url: string, options?: RequestInit) {
  return await fetch(`${BASE_API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Network Error!");
    }
    if (response.status === 204) {
      return null;
    }
    // if (response.status === 500) {
    //   const message = await response.text();
    //   throw new Error(message || "Network Error!");
    // }
    return response.json();
  });
}
