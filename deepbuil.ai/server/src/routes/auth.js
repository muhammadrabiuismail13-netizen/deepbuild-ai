import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(120),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/signup", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const user = await User.create(data);
    const token = signToken(user._id);
    res.status(201).json({ user: user.toSafeJSON(), token });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input", issues: err.issues });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await user.comparePassword(data.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user._id);
    res.json({ user: user.toSafeJSON(), token });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input" });
    }
    next(err);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export default router;
