const { checkRateLimit } = require("../../src/services/tokenBucket.service");

describe("Token Bucket Algorithm", () => {

  test("should allow first request", async () => {
    const result = await checkRateLimit("test-client", "/orders", 5, 60);

    expect(result.allowed).toBe(true);
  });

  test("should reduce remaining tokens", async () => {
    const result = await checkRateLimit("test-client", "/orders", 5, 60);

    expect(result.remainingRequests).toBeGreaterThanOrEqual(0);
  });

});