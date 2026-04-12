import express, { type Router } from "express";
import { authController } from "../controllers/auth.controller";

const authRouter: Router = express.Router();

// Google OAuth
authRouter.get("/google", authController.googleAuth);
authRouter.get("/google/callback", authController.googleCallback);

// Registration
authRouter.post("/register", authController.register);

// Current user
authRouter.get("/me", authController.getMe);

// Refresh token
authRouter.post("/refresh", authController.refreshToken);

// Logout
authRouter.post("/logout", authController.logout);

// Update profile
authRouter.put("/profile", authController.updateProfile);

export default authRouter;
