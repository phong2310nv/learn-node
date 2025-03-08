const mongoose = require("mongoose");
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const redisClient = redis.createClient(redisUrl);
redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis connection error:", err));
redisClient.connect();
const exec = mongoose.Query.prototype.exec;
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

mongoose.Query.prototype.cache = async function (option = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(option.key || "");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    await delay();
    return exec.apply(this, arguments);
  }

  console.log("I am about to run a query");
  const key = `${this.mongooseCollection.name}:${JSON.stringify(
    this.getQuery()
  )}`;
  const cachedValue = await redisClient.hGet(this.hashKey, key);
  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    console.log("Cache hit");
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }
  await delay();
  console.log(this.mongooseCollection.name);
  const result = await exec.apply(this, arguments);
  console.log("from db");
  redisClient.hSet(this.hashKey, key, JSON.stringify(result));

  return result;
};
async function clearHash(hashKey) {
  await redisClient.del(JSON.stringify(hashKey));
}

module.exports = {
  clearHash,
};
