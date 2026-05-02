import "dotenv/config";

import connectDB from "../src/config/db.js";
import userModel from "../src/models/user.model.js";

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existing = await userModel.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });

    if (existing) {
      console.log("Super admin already exists");
      process.exit(0);
    }

    await userModel.create({
      username: process.env.SUPER_ADMIN_USERNAME || "superadmin",
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD, 
      verified: true,
      role: "SUPER_ADMIN",
      tenant: null,
    });

    console.log("SUPER_ADMIN seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seedSuperAdmin();