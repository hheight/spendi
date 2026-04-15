import { Prisma } from "@/app/generated/prisma";

type ErrorCategory = "user" | "system";

type ParsedError = {
  message: string;
  category: ErrorCategory;
};

export function parsePrismaError(error: unknown): ParsedError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handleKnownRequestError(error);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return { message: "Failed to connect to database", category: "system" };
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return { message: "Database connection error", category: "system" };
  }

  if (error instanceof Error) {
    return { message: error.message, category: "system" };
  }

  return { message: "An unexpected error occurred", category: "system" };
}

function handleKnownRequestError(
  error: Prisma.PrismaClientKnownRequestError
): ParsedError {
  switch (error.code) {
    case "P2002":
      return { message: "A record with this value already exists", category: "user" };
    case "P2025":
      return { message: "Record not found", category: "user" };
    case "P2003":
      return { message: "Referenced record does not exist", category: "user" };
    case "P2000":
      return { message: "The provided value is too large", category: "user" };
    case "P2014":
      return { message: "Relation constraint violated", category: "user" };
    case "P2011":
      return { message: "Null value not allowed", category: "user" };
    case "P2016":
      return { message: "Query validation error", category: "system" };
    case "P2019":
      return { message: "Input validation error", category: "user" };
    case "P2024":
      return { message: "Operation timed out", category: "system" };
    case "P2034":
      return { message: "Operation failed", category: "system" };
    default:
      return { message: "Database operation failed", category: "system" };
  }
}

export function getUserMessage(error: unknown): string {
  const parsed = parsePrismaError(error);
  return parsed.category === "user"
    ? parsed.message
    : "Something went wrong. Please try again.";
}

export function logPrismaError(error: unknown, context: string): void {
  const parsed = parsePrismaError(error);
  const code =
    error instanceof Prisma.PrismaClientKnownRequestError ? error.code : "UNKNOWN";
  console.error(`[Prisma] ${context}:`, {
    code,
    message: parsed.message,
    category: parsed.category
  });
}
