db.clients.insertMany([
  {
    clientId: "test1",
    hashedApiKey: "dummy",
    maxRequests: 5,
    windowSeconds: 60
  },
  {
    clientId: "test2",
    hashedApiKey: "dummy",
    maxRequests: 10,
    windowSeconds: 60
  },
  {
    clientId: "test3",
    hashedApiKey: "dummy",
    maxRequests: 15,
    windowSeconds: 60
  }
]);