import path from "path";
import { fileURLToPath } from "url";

<<<<<<< HEAD
import dotenv from "dotenv";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

=======
dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

>>>>>>> 6ae7f9d8a3431a9b798a651f7eb76a80986738fe
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
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
