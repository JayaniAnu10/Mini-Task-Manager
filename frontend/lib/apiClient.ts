import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AxiosError)) {
    return fallback;
  }

  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }

    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
  }

  return fallback;
}
