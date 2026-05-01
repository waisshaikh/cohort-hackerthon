import mongoose from "mongoose";

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildMongoErrorHint = (error) => {
  if (error?.message?.includes("querySrv ECONNREFUSED")) {
    return [
      "MongoDB SRV lookup failed.",
      "This is usually a DNS/network issue, not a password issue.",
      "Try one of these:",
      "1. Re-copy the Atlas connection string from Connect > Drivers.",
      "2. Use a non-SRV mongodb:// URI if Atlas provides one.",
      "3. Change local DNS to 8.8.8.8 or 1.1.1.1.",
      "4. Ensure the Atlas cluster is running and your IP is whitelisted.",
    ].join("\n");
  }

  return null;
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const retryAttempts = Number(process.env.MONGODB_RETRY_ATTEMPTS || DEFAULT_RETRY_ATTEMPTS);
  const retryDelayMs = Number(process.env.MONGODB_RETRY_DELAY_MS || DEFAULT_RETRY_DELAY_MS);

  if (!mongoUri) {
    console.error("MongoDB connection failed: MONGODB_URI is not configured");
    return false;
  }

  for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
    try {
      const connection = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      globalThis.__mongooseConnected = true;
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return true;
    } catch (error) {
      console.error(
        `MongoDB connection failed (attempt ${attempt}/${retryAttempts}): ${error.message}`
      );

      const hint = buildMongoErrorHint(error);
      if (hint) {
        console.error(hint);
      }

      if (attempt < retryAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  globalThis.__mongooseConnected = false;
  return false;
};

export default connectDB;
