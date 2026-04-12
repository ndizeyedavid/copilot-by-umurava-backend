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
};

export default ENV;
