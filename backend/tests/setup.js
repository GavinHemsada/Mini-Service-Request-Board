const mongoose = require("mongoose");

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

beforeAll(async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set for backend tests.");
  }

  process.env.MONGODB_URI = toTestMongoUri(process.env.MONGODB_URI);

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
});
