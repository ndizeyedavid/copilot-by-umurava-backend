import dotenv from "dotenv";
dotenv.config();

const ENV = {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI as string,
  gemingi_api_key: process.env.GEMINI_API_KEY,
  gemini_model: process.env.GEMINI_MODEL as string,
};

export default ENV;
