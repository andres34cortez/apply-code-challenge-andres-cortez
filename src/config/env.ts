/**
 * Environment configuration
 * Handles environment variables with sensible defaults
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

/**
 * Get the API URL, with automatic detection for production
 * In production, if NEXT_PUBLIC_API_URL is not set, it will use a relative URL
 */
const getApiUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.NODE_ENV === "production") {
    return "";
  }

  return "http://localhost:3000";
};

export const env = {
  apiUrl: getApiUrl(),
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;
