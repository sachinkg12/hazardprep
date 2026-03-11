export interface FetchOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1_000;

export async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES, retryDelay = DEFAULT_RETRY_DELAY } =
    options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MyHazardProfile/0.1.0 (https://github.com/myhazardprofile)',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError;
}
