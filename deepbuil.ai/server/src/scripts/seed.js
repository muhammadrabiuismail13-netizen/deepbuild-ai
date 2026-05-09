import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

async function main() {
  await connectDB(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  }

  let user = await User.findOne({ email });
  if (user) {
    user.role = "admin";
    user.name = name;
    user.password = password; // pre-save hook re-hashes
    await user.save();
    console.log(`♻️  Updated existing user → admin: ${email}`);
  } else {
    user = await User.create({ name, email, password, role: "admin" });
    console.log(`✅ Created admin user: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
