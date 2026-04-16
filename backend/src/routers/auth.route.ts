import express, { type Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const authRouter: Router = express.Router();

// Google OAuth
authRouter.get("/google", authController.googleAuth);
authRouter.get("/google/callback", authController.googleCallback);
authRouter.post("/google/one-tap", authController.googleOneTap);

// Link Google account (requires existing session)
authRouter.post(
  "/google/link/one-tap",
  requireAuth,
  authController.linkGoogleOneTap,
);

// Registration
authRouter.post("/register/google", authController.registerGoogle);
authRouter.post("/register/local", authController.registerLocal);

// Login
authRouter.post("/login/local", authController.loginLocal);

// Current user
authRouter.get("/me", requireAuth, authController.getMe);

// Refresh token
authRouter.post("/refresh", requireAuth, authController.refreshToken);

// Logout
authRouter.post("/logout", requireAuth, authController.logout);

// Update profile
authRouter.put("/profile", requireAuth, authController.updateProfile);

// Update password
authRouter.put("/password", requireAuth, authController.updatePassword);

export default authRouter;
