import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://coolify.monu14.me";

const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY || "";

// ─── Axios Instance ───────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, // 2 min for large file uploads
  headers: {
    Accept: "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach API key from env or localStorage (allows runtime override)
    const key =
      typeof window !== "undefined"
        ? localStorage.getItem("truthlens_api_key") || API_KEY
        : API_KEY;

    if (key) {
      config.headers["X-API-Key"] = key;
    }

    // Don't override Content-Type for FormData (browser sets boundary automatically)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, unknown>;

      if (status === 401 || status === 403) {
        console.error("[TruthLens] Unauthorized – check your API key.");
      } else if (status === 422) {
        console.error("[TruthLens] Validation error:", data);
      } else if (status >= 500) {
        console.error("[TruthLens] Server error:", status, data);
      }
    } else if (error.request) {
      console.error("[TruthLens] No response received – network issue.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
