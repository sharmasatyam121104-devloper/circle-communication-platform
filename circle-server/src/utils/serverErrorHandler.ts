import { Response } from "express";

interface ErrorMessage extends Error {
  status?: number;
}

export const tryError = (message: string, status: number) => {
  const error: ErrorMessage = new Error(message);
  error.status = status;
  return error;
};

export const catchError = (
  error: unknown,
  res: Response,
  prodMessage: string = "Internal Server Error"
) => {
  const isDev = process.env.NODE_ENV === "development";

  if (error instanceof Error) {
    const status = (error as ErrorMessage).status || 500;

    const response: any = {
      success: false,
      status,
      message: error.message, // real error always
    };

    // DEV ONLY DEBUG INFO
    if (isDev && error.stack) {
      const stackLines = error.stack
        .split("\n")
        .filter(
          (line) =>
            !line.includes("node_modules") &&
            line.trim() !== ""
        );

      response.stack = stackLines.map((l) => l.trim());

      const locationLine =
        stackLines.find(
          (line) =>
            !line.includes("node_modules") &&
            !line.includes("errorHandler.ts") &&
            line.trim().startsWith("at")
        ) || "";

      const match =
        locationLine.match(/\((.*)\)/) ||
        locationLine.match(/at (.*)/);

      response.location = match ? match[1] : undefined;
    }

    return res.status(status).json(response);
  }

  // ONLY unknown error uses prodMessage fallback
  return res.status(500).json({
    success: false,
    status: 500,
    message: isDev ? String(error) : prodMessage,
  });
};