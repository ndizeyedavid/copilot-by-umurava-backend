import dotenv from "dotenv";
dotenv.config();

const ENV = {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI as string,
  gemingi_api_key: process.env.GEMINI_API_KEY,
  gemini_model: process.env.GEMINI_MODEL as string,
  smtp_host: process.env.SMTP_HOST as string,
  smtp_port: parseInt(process.env.SMTP_PORT || "587"),
  smtp_user: process.env.SMTP_USER as string,
  smtp_pass: process.env.SMTP_PASS as string,
  email_from: process.env.EMAIL_FROM as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  google_client_id: process.env.GOOGLE_CLIENT_ID as string,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL as string,
  frontend_url: process.env.FRONTEND_URL as string,
};

export default ENV;
