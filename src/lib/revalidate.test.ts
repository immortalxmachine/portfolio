import { describe, expect, it } from "vitest";

import { isValidSecret } from "./revalidate";

describe("isValidSecret", () => {
  it("accepts an exact match", () => {
    expect(isValidSecret("s3cret", "s3cret")).toBe(true);
  });

  it("rejects a mismatch of equal length", () => {
    expect(isValidSecret("s3creX", "s3cret")).toBe(false);
  });

  it("rejects different lengths", () => {
    expect(isValidSecret("s3cret-long", "s3cret")).toBe(false);
  });

  it("fails closed when no secret is configured", () => {
    expect(isValidSecret("anything", undefined)).toBe(false);
    expect(isValidSecret("anything", "")).toBe(false);
  });

  it("rejects missing/empty provided secret", () => {
    expect(isValidSecret(null, "s3cret")).toBe(false);
    expect(isValidSecret(undefined, "s3cret")).toBe(false);
    expect(isValidSecret("", "s3cret")).toBe(false);
  });
});
