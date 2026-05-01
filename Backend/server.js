import "dotenv/config";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { loadMemoryStore } from "./src/utils/memoryStore.js";

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

const startServer = async () => {
  const isDbConnected = await connectDB();

  if (!isDbConnected && isProduction) {
    console.error("Stopping server because MongoDB is required in production.");
    process.exit(1);
  }

  if (!isDbConnected) {
    console.warn(
      "Starting server without MongoDB connection. Database-backed features like AI logging will fail until MongoDB is reachable."
    );
    loadMemoryStore();
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
