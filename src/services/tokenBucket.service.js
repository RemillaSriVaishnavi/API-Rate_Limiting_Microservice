const redisClient = require("../config/redis.config");

exports.checkRateLimit = async (clientId, path, maxRequests, windowSeconds) => {
  const key = `${clientId}:${path}`;

  let bucket = await redisClient.get(key);

  if (!bucket) {
    const newBucket = {
      tokens: maxRequests - 1,
      lastRefill: Date.now()
    };

    await redisClient.set(key, JSON.stringify(newBucket), {
      EX: windowSeconds
    });

    return {
      allowed: true,
      remainingRequests: newBucket.tokens,
      resetTime: new Date(Date.now() + windowSeconds * 1000)
    };
  }

  bucket = JSON.parse(bucket);

  const now = Date.now();
  const elapsed = (now - bucket.lastRefill) / 1000;
  const refillRate = maxRequests / windowSeconds;

  bucket.tokens = Math.min(
    maxRequests,
    bucket.tokens + elapsed * refillRate
  );

  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    await redisClient.set(key, JSON.stringify(bucket), {
      EX: windowSeconds
    });

    return {
      allowed: true,
      remainingRequests: Math.floor(bucket.tokens),
      resetTime: new Date(now + windowSeconds * 1000)
    };
  }

  return {
    allowed: false,
    retryAfter: Math.ceil((1 - bucket.tokens) / refillRate),
    resetTime: new Date(now + windowSeconds * 1000)
  };
};