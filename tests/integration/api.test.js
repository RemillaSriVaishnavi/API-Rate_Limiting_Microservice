jest.setTimeout(20000);
const request = require("supertest");
const app = require("../../src/app");

describe("API Integration Tests", () => {

  test("Health check endpoint", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
  });

  test("Register Client", async () => {
    const res = await request(app)
      .post("/api/v1/clients")
      .send({
        clientId: "integration-test",
        apiKey: "secret",
        maxRequests: 5,
        windowSeconds: 60
      });

    expect([201,409]).toContain(res.statusCode);
  });

  test("Rate limit check", async () => {
    const res = await request(app)
      .post("/api/v1/ratelimit/check")
      .send({
        clientId: "integration-test",
        path: "/orders"
      });

    expect([200,429]).toContain(res.statusCode);
  });

});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});