import { Request, Response } from "express";
import ENV from "../config/env";
import {
  generateTokens,
  createUser,
  getUserById,
  findOrCreateUser,
} from "../services/auth.service";
import { IGoogleProfile, UserRole } from "../types/user.types";
import User from "../models/user.model";

const authController = {
  // Initiate Google OAuth
  googleAuth(req: Request, res: Response) {
    const { role } = req.query;
    
    // Store role in session/state for callback
    if (role && (role === "talent" || role === "admin")) {
      (req as any).session = { role };
    }
    
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${ENV.google_client_id}&` +
      `redirect_uri=${encodeURIComponent(ENV.google_callback_url)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("openid email profile")}&` +
      `state=${role || ""}`;
    
    res.redirect(googleAuthUrl);
  },

  // Handle Google OAuth callback
  async googleCallback(req: Request, res: Response) {
    try {
      const { code, state } = req.query;
      const role = state as UserRole || "talent";

      if (!code) {
        return res.redirect(`${ENV.frontend_url}/auth/error?message=No authorization code received`);
      }

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: ENV.google_client_id,
          client_secret: ENV.google_client_secret,
          redirect_uri: ENV.google_callback_url,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        return res.redirect(`${ENV.frontend_url}/auth/error?message=Failed to exchange code`);
      }

      // Get user info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );

      const googleUser = await userInfoResponse.json();

      if (!userInfoResponse.ok) {
        return res.redirect(`${ENV.frontend_url}/auth/error?message=Failed to get user info`);
      }

      // Build Google profile
      const googleProfile: IGoogleProfile = {
        id: googleUser.id,
        displayName: googleUser.name,
        name: {
          familyName: googleUser.family_name,
          givenName: googleUser.given_name,
        },
        emails: [{ value: googleUser.email, verified: googleUser.verified_email }],
        photos: [{ value: googleUser.picture }],
      };

      // Find or create user
      const { user, isNew } = await findOrCreateUser(googleProfile, role);

      // Generate JWT tokens
      const tokens = generateTokens(user);

      // Redirect to frontend with tokens
      const redirectUrl = `${ENV.frontend_url}/auth/callback?` +
        `token=${tokens.accessToken}&` +
        `isNew=${isNew}&` +
        `role=${user.role}`;

      res.redirect(redirectUrl);
    } catch (error: any) {
      console.error("Google callback error:", error);
      res.redirect(`${ENV.frontend_url}/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  },

  // Register new user with role selection
  async register(req: Request, res: Response) {
    try {
      const { googleProfile, role, talentProfileId }: {
        googleProfile: IGoogleProfile;
        role: UserRole;
        talentProfileId?: string;
      } = req.body;

      if (!googleProfile || !role) {
        return res.status(400).json({
          message: "Google profile and role are required",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ googleId: googleProfile.id });
      if (existingUser) {
        const tokens = generateTokens(existingUser);
        return res.status(200).json({
          message: "User already exists",
          user: {
            _id: existingUser._id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            picture: existingUser.picture,
            role: existingUser.role,
            talentProfileId: existingUser.talentProfileId,
          },
          tokens,
        });
      }

      // Create new user
      const user = await createUser(googleProfile, role, talentProfileId);
      const tokens = generateTokens(user);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          role: user.role,
          talentProfileId: user.talentProfileId,
        },
        tokens,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Registration failed",
        error: error.message,
      });
    }
  },

  // Get current user
  async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        user,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to get user",
        error: error.message,
      });
    }
  },

  // Refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await User.findById(userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "User not found or inactive" });
      }

      const tokens = generateTokens(user);

      return res.status(200).json({
        message: "Token refreshed",
        tokens,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to refresh token",
        error: error.message,
      });
    }
  },

  // Logout
  async logout(req: Request, res: Response) {
    return res.status(200).json({
      message: "Logged out successfully",
    });
  },

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { firstName, lastName, picture } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, picture },
        { new: true }
      ).select("-googleId");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Profile updated",
        user,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to update profile",
        error: error.message,
      });
    }
  },
};

export { authController };
