type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  [key: string]: unknown;
}

const SERVICE_NAME = process.env.SERVICE_NAME || "fullstack-serverless-ssr";

/**
 * Structured JSON logger for Lambda / CloudWatch.
 *
 * Outputs JSON lines in production for machine parsing.
 * Outputs human-readable format in development.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info("User created", { userId: "123" });
 *   logger.error("Failed to fetch", { url, status });
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>,
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: SERVICE_NAME,
    ...(meta || {}),
  };
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = createLogEntry(level, message, meta);

  if (process.env.NODE_ENV === "production") {
    // JSON lines for CloudWatch / structured log ingestion
    const output = JSON.stringify(entry);
    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
  } else {
    // Human-readable in development
    const prefix = `[${level.toUpperCase()}]`;
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    if (level === "error") {
      console.error(`${prefix} ${message}${metaStr}`);
    } else if (level === "warn") {
      console.warn(`${prefix} ${message}${metaStr}`);
    } else if (level === "debug") {
      console.debug(`${prefix} ${message}${metaStr}`);
    } else {
      console.log(`${prefix} ${message}${metaStr}`);
    }
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log("debug", message, meta),
};
