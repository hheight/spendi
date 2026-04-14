import { vi } from "vitest";

vi.mock("@/lib/prisma");
vi.mock("server-only", () => ({}));
