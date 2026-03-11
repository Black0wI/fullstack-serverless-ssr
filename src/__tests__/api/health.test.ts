import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns a non-cacheable health payload", async () => {
    const response = await GET();
    const payload = (await response.json()) as {
      status: string;
      checks: {
        configuration: {
          authConfigured: boolean;
          cloudflareConfigured: boolean;
          pwaEnabled: boolean;
        };
      };
    };

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
    expect(payload.status).toBe("ok");
    expect(payload.checks.configuration.pwaEnabled).toBe(true);
    expect(payload.checks.configuration.authConfigured).toBe(false);
    expect(payload.checks.configuration.cloudflareConfigured).toBe(false);
  });
});
