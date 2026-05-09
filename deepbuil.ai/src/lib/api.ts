/**
 * Tiny typed fetch wrapper around the DeepBuild.ai backend.
 * Set VITE_API_URL in your .env.local (e.g. http://localhost:5000/api).
 */

export const API_URL: string =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:5000/api";

const TOKEN_KEY = "deepbuild.token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ReqOpts = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
  signal?: AbortSignal;
};

export async function api<T = unknown>(
  path: string,
  opts: ReqOpts = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (!opts.formData) headers["Content-Type"] = "application/json";

  if (opts.auth !== false) {
    const t = tokenStore.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method || (opts.body || opts.formData ? "POST" : "GET"),
    headers,
    body: opts.formData
      ? opts.formData
      : opts.body
        ? JSON.stringify(opts.body)
        : undefined,
    signal: opts.signal,
  });

  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

// Multipart upload helper with progress (uses XHR for upload events)
export function uploadFile(
  path: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append("file", file);

    xhr.open("POST", `${API_URL}${path}`);
    const t = tokenStore.get();
    if (t) xhr.setRequestHeader("Authorization", `Bearer ${t}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) resolve(body);
        else reject(new ApiError(body.error || "Upload failed", xhr.status));
      } catch (e) {
        reject(new ApiError("Bad server response", xhr.status));
      }
    };
    xhr.onerror = () => reject(new ApiError("Network error", 0));
    xhr.send(fd);
  });
}
