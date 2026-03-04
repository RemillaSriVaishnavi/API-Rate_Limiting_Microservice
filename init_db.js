db = db.getSiblingDB("ratelimitdb");

db.createCollection("clients");

db.clients.insertMany([
  {
    clientId: "abc",
    apiKey: "secret",
    maxRequests: 5,
    windowSeconds: 60
  },
  {
    clientId: "test-client",
    apiKey: "test-secret",
    maxRequests: 10,
    windowSeconds: 60
  }
]);