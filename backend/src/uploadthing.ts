import { createUploadthing, type FileRouter } from "uploadthing/express";
import Talent from "./models/talents.model";
import User from "./models/user.model";
import { verifyToken } from "./services/auth.service";
import pdfParse = require("pdf-parse");
import { GoogleGenAI } from "@google/genai";
import ENV from "./config/env";
import axios from "axios";

const f = createUploadthing();
const genAI = new GoogleGenAI({ apiKey: ENV.gemini_api_key as string });

function buildResumeParsingPrompt(resumeText: string, user: any): string {
  return `You are an expert resume parser. Extract structured information from the resume text.

## USER INFO (use as hints if text is unclear)
- Name: ${user.firstName} ${user.lastName || ""}
- Email: ${user.email}

## RESUME TEXT TO PARSE
\`\`\`
${resumeText.slice(0, 8000)}
\`\`\`

## TASK
Return ONLY valid JSON with this exact structure:
{
  "headline": "string - professional title/headline",
  "summary": "string - professional summary/objective",
  "location": "string - city and country",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "company": "string",
      "role": "string - job title",
      "description": "string - key responsibilities",
      "startDate": "string - e.g. '2020-01' or 'Jan 2020'",
      "endDate": "string - e.g. '2023-12' or 'Present'",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "education": [
    {
      "institution": "string - university name",
      "degree": "string - e.g. 'Bachelor of Science'",
      "field": "string - e.g. 'Computer Science'"
    }
  ],
  "certifications": ["Certification Name - Issuer"]
}

## RULES
1. Extract ALL technical skills, tools, and languages
2. For experience: include ALL jobs with descriptions
3. Dates: use YYYY-MM format when possible
4. If a field is not found, use empty string/array
5. Return ONLY valid JSON, no markdown or explanations`;
}

export const uploadRouter = {
  cvUploader: f({
    pdf: { maxFileSize: "1024MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) throw new Error("Unauthorized: No token provided");

      try {
        const user = verifyToken(token);
        if (!user || user.role !== "talent")
          throw new Error("Unauthorized: Invalid role");
        return { userId: user.userId };
      } catch (error: any) {
        throw new Error(`Unauthorized: ${error.message}`);
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      try {
        const user = await User.findById(metadata.userId);
        if (!user) {
          console.error("User not found for metadata:", metadata.userId);
          return;
        }

        // @ts-ignore
        let talent = await Talent.findOne({ userId: metadata.userId });
        if (!talent) {
          talent = new Talent({
            userId: metadata.userId,
            headline: "Talent",
            location: "Remote",
            skills: [],
            experience: [],
            availability: { status: "Available", type: "Full-time" },
            socialLinks: [],
          });
        }

        // Fetch file content for parsing if it's a PDF
        const isPdf =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");

        if (isPdf) {
          try {
            const response = await axios.get(file.ufsUrl, {
              responseType: "arraybuffer",
            });
            const pdfBuffer = Buffer.from(response.data);
            const parsed = await pdfParse(pdfBuffer);
            const resumeText = parsed.text;

            if (resumeText && resumeText.trim().length > 10) {
              const prompt = buildResumeParsingPrompt(resumeText, user);

              const aiResponse = await genAI.models.generateContent({
                model: ENV.gemini_model,
                contents: prompt,
                config: {
                  temperature: 0.1,
                  responseMimeType: "application/json",
                },
              });

              const text = aiResponse.text;
              if (text) {
                try {
                  const parsedData = JSON.parse(text);

                  talent.headline =
                    parsedData.headline || talent.headline || "";
                  talent.bio = parsedData.summary || talent.bio || "";
                  talent.location =
                    parsedData.location || talent.location || "";

                  if (parsedData.skills && Array.isArray(parsedData.skills)) {
                    talent.skills = parsedData.skills.map((s: string) => ({
                      name: s,
                      level: "Intermediate",
                      yearsOfExperience: 1,
                    }));
                  }

                  if (
                    parsedData.experience &&
                    Array.isArray(parsedData.experience)
                  ) {
                    talent.experience = parsedData.experience.map((e: any) => ({
                      company: e.company || "",
                      role: e.role || "",
                      startDate: e.startDate
                        ? new Date(e.startDate)
                        : new Date(),
                      endDate:
                        e.endDate && e.endDate !== "Present"
                          ? new Date(e.endDate)
                          : undefined,
                      description: e.description || "",
                      technologies: e.technologies || [],
                      IsCurrent: e.endDate === "Present" || !e.endDate,
                    }));
                  }

                  if (
                    parsedData.education &&
                    Array.isArray(parsedData.education)
                  ) {
                    talent.education = parsedData.education.map((e: any) => ({
                      institution: e.institution || "",
                      degree: e.degree || "",
                      fieldOfStudy: e.field || "",
                      startYear: new Date(),
                      endYear: new Date(),
                    }));
                  }

                  if (
                    parsedData.certifications &&
                    Array.isArray(parsedData.certifications)
                  ) {
                    talent.certifications = parsedData.certifications.map(
                      (c: string) => ({
                        name: c,
                        issuer: "",
                        issueDate: new Date(),
                      }),
                    );
                  }

                  talent.rawCv = { text: resumeText, parsedAt: new Date() };
                } catch (jsonError) {
                  console.error("Failed to parse AI response JSON:", jsonError);
                }
              }
            }
          } catch (parseError) {
            console.error("Failed to parse PDF content:", parseError);
          }
        }

        talent.cvUrl = file.ufsUrl;
        await talent.save();

        await User.findByIdAndUpdate(metadata.userId, {
          talentProfileId: talent._id,
        });
      } catch (error) {
        console.error("Failed to process uploaded CV:", error);
      }

      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),

  profilePictureUploader: f({
    image: { maxFileSize: "1024MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) throw new Error("Unauthorized: No token provided");

      try {
        const user = verifyToken(token);
        if (!user || user.role !== "talent")
          throw new Error("Unauthorized: Invalid role");
        return { userId: user.userId };
      } catch (error: any) {
        throw new Error(`Unauthorized: ${error.message}`);
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        "Profile picture upload complete for userId:",
        metadata.userId,
      );
      console.log("File URL:", file.ufsUrl);

      try {
        await User.findByIdAndUpdate(metadata.userId, {
          picture: file.ufsUrl,
        });
      } catch (error) {
        console.error("Failed to update user profile picture:", error);
      }

      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
