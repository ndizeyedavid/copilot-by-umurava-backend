import express, { type Router, RequestHandler } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const authRouter: Router = express.Router();

const auth = requireAuth as RequestHandler;

// Google OAuth
authRouter.get("/google", authController.googleAuth);
authRouter.get("/google/callback", authController.googleCallback);
authRouter.post("/google/one-tap", authController.googleOneTap);

// Link Google account (requires existing session)
authRouter.post("/google/link/one-tap", auth, authController.linkGoogleOneTap);

// Registration
authRouter.post("/register/google", authController.registerGoogle);
authRouter.post("/register/local", authController.registerLocal);

// Login
authRouter.post("/login/local", authController.loginLocal);

// Current user
authRouter.get("/me", auth, authController.getMe);

// Refresh token
authRouter.post("/refresh", auth, authController.refreshToken);

// Logout
authRouter.post("/logout", auth, authController.logout);

// Update profile
authRouter.put("/profile", auth, authController.updateProfile);

// Update password
authRouter.put("/password", auth, authController.updatePassword);

export default authRouter;
