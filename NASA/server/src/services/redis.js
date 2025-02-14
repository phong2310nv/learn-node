const redis = require("redis");
console.log( `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
console.log(process.env.MONGO_URL);


const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
console.log({
  host: process.env.REDIS_HOST, // Service name in Docker Compose
  port: process.env.REDIS_PORT,
});

client.on("connect", () => console.log("Redis connected"));
client.on("error", (err) => console.error("Redis connection error:", err));

module.exports = {
  redisClient: client,
};
