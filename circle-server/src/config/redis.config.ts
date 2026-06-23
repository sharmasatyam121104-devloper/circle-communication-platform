import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error(
    "REDIS_URL is missing in environment variables"
  );
}

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,

  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);

    console.log(
      `Redis reconnecting... Attempt ${times}`
    );

    return delay;
  },
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("ready", () => {
  console.log("Redis Ready");
});

redis.on("error", (error) => {
  console.error(
    "Redis Error:",
    error.message
  );
});

redis.on("close", () => {
  console.log(
    "Redis Connection Closed"
  );
});

redis.on("reconnecting", () => {
  console.log(
    "Redis Reconnecting..."
  );
});

redis.on("end", () => {
  console.log(
    "Redis Connection Ended"
  );
});

export default redis;