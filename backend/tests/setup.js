const mongoose = require("mongoose");

let mongoServer;

/** Use an isolated DB name so tests never touch dev/seed data. */
function toTestMongoUri(uri) {
  const qIndex = uri.indexOf("?");
  const query = qIndex >= 0 ? uri.slice(qIndex) : "";
  const withoutQuery = qIndex >= 0 ? uri.slice(0, qIndex) : uri;
  const slash = withoutQuery.lastIndexOf("/");
  const hasDbName =
    slash > withoutQuery.indexOf("://") + 2 && slash < withoutQuery.length - 1;

  if (!hasDbName) {
    return `${withoutQuery}/globaltna_jest${query}`;
  }
  return `${withoutQuery.slice(0, slash + 1)}globaltna_jest${query}`;
}

async function startMemoryServer() {
  const { MongoMemoryServer } = require("mongodb-memory-server");
  mongoServer = await MongoMemoryServer.create({
    instance: { dbName: "globaltna_jest" },
  });
  return mongoServer.getUri();
}

beforeAll(async () => {
  const useMemory =
    process.env.JEST_USE_MEMORY_DB === "1" || !process.env.MONGODB_URI;

  if (useMemory) {
    process.env.MONGODB_URI = await startMemoryServer();
  } else {
    process.env.MONGODB_URI = toTestMongoUri(process.env.MONGODB_URI);
  }

  if (mongoose.connection.readyState === 0) {
    const { connectDb } = require("../src/config/db");
    await connectDb();
  }
}, 120000);

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});
