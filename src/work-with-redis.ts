import redis from "redis";

async function manageRedis(): Promise<void> {
  const client = redis.createClient();

  client.on("error", (err) => {
    console.error("Error connecting to Redis:", err);
  });

  await client.connect();

  await client.set("user1", "Alice");
  await client.set("user2", "Bob");

  const value = await client.get("user1");
  console.log("Value for user1:", value);

  await client.quit();
}

module.exports = { manageRedis };
