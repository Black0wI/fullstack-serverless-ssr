import { describe, expect, it } from "vitest";
import { createMetadata } from "@/lib/seo";

describe("createMetadata", () => {
  it("uses the boilerplate site defaults", () => {
    const metadata = createMetadata({
      title: "Docs",
      description: "Docs page",
      path: "/docs",
    });

    expect(metadata.title).toBe("Docs | Next.js SST Boilerplate");
    expect(metadata.metadataBase?.toString()).toBe("https://boilerplate.example.com/");
    expect(metadata.alternates?.canonical).toBe("https://boilerplate.example.com/docs");
  });
});
