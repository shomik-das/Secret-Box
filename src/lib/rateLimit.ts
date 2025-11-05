import redis from "@/lib/redis";

export async function rateLimit(
  identifier: string,
  limit = 5,
  windowSeconds = 60
) {
  const key = `ratelimit:${identifier}`;

  // Increment request count
  const requests = await redis.incr(key);

  if (requests === 1) {
    // First request → set expiry
    await redis.expire(key, windowSeconds);
  }

  if (requests > limit) {
    const ttl = await redis.ttl(key);
    return {
      success: false,
      remainingTime: ttl,
      message: `Rate limit exceeded. Try again in ${ttl}s.`,
    };
  }

  return {
    success: true,
    remaining: limit - requests,
  };
}
