import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Session from "../models/session.model";
import ENV from "../config/env";
import {
  IUser,
  IGoogleProfile,
  IJwtPayload,
  UserRole,
} from "../types/user.types";

// ... existing passport code ...

export async function createSession(
  userId: string,
  token: string,
  ipAddress?: string,
  userAgent?: string,
) {
  return await Session.create({
    userId,
    token,
    ipAddress,
    userAgent,
    lastAccess: new Date(),
    isActive: true,
  });
}

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.google_client_id,
      clientSecret: ENV.google_client_secret,
      callbackURL: ENV.google_callback_url,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ) => {
      try {
        const googleProfile: IGoogleProfile = {
          id: profile.id,
          displayName: profile.displayName,
          name: profile.name,
          emails: profile.emails,
          photos: profile.photos,
        };

        // Check if user exists
        let user = await User.findOne({ googleId: googleProfile.id });

        if (!user) {
          // New user - will need to select role
          return done(null, {
            isNewUser: true,
            googleProfile,
          });
        }

        // Existing user
        if (!user.isActive) {
          return done(new Error("Account is deactivated"), false);
        }

        return done(null, {
          isNewUser: false,
          user,
        });
      } catch (error) {
        return done(error as Error, false);
      }
    },
  ),
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export function generateTokens(user: IUser) {
  const payload: IJwtPayload = {
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
  };

  const expiresIn = "24h";

  const accessToken = jwt.sign(payload, ENV.jwt_secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });

  return { accessToken };
}

export function verifyToken(token: string): IJwtPayload {
  return jwt.verify(token, ENV.jwt_secret) as IJwtPayload;
}

export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  password?: string,
  googleId?: string,
  picture?: string,
  phone?: string,
  talentProfileId?: string,
): Promise<IUser> {
  const userDoc = new User({
    googleId,
    email,
    password,
    firstName,
    lastName,
    picture,
    phone,
    role,
    talentProfileId,
  });

  await userDoc.save();
  const user = userDoc.toObject() as IUser;
  return user;
}

export async function createGoogleUser(
  googleProfile: IGoogleProfile,
  role: UserRole,
  talentProfileId?: string,
): Promise<IUser> {
  const email = googleProfile.emails?.[0]?.value;
  if (!email) {
    throw new Error("No email provided from Google");
  }

  return createUser(
    email,
    googleProfile.name.givenName,
    googleProfile.name.familyName,
    role,
    undefined,
    googleProfile.id,
    googleProfile.photos?.[0]?.value,
    undefined,
    talentProfileId,
  );
}

export async function findOrCreateUser(
  googleProfile: IGoogleProfile,
  role: UserRole,
): Promise<{ user: IUser; isNew: boolean }> {
  const userDoc = await User.findOne({ googleId: googleProfile.id });

  if (userDoc) {
    const user = userDoc.toObject() as IUser;
    return { user, isNew: false };
  }

  const user = await createGoogleUser(googleProfile, role);
  return { user, isNew: true };
}

export async function getUserById(userId: string): Promise<IUser | null> {
  const userDoc = await User.findById(userId).select("+password").lean();
  if (!userDoc) return null;

  return {
    ...(userDoc as any),
    hasPassword: !!(userDoc as any).password,
  } as any;
}

export { passport };
