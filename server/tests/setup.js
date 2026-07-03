const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Force testing environment variables
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/rent-flatmate-finder-test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecrettokenforflatmatefinder";

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
