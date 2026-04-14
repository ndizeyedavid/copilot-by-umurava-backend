import csv from "csv-parser";
import xlsx from "xlsx";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import axios from "axios";
import { IExternalApplicant, ParsedResume } from "../types/external-screening.types";

export async function parseSpreadsheet(filePath: string): Promise<IExternalApplicant[]> {
  const ext = path.extname(filePath).toLowerCase();
  const applicants: IExternalApplicant[] = [];

  if (ext === ".csv") {
    return parseCSV(filePath);
  } else if (ext === ".xlsx" || ext === ".xls") {
    return parseExcel(filePath);
  }

  throw new Error("Unsupported file format. Only CSV and Excel files are allowed.");
}

function parseCSV(filePath: string): Promise<IExternalApplicant[]> {
  return new Promise((resolve, reject) => {
    const results: IExternalApplicant[] = [];
    let rowIndex = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => {
        rowIndex++;
        const applicant = mapRowToApplicant(data, `csv-row-${rowIndex}`);
        if (applicant.email) {
          results.push(applicant);
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

function parseExcel(filePath: string): IExternalApplicant[] {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet);

  return rows
    .map((row: any, index: number) => mapRowToApplicant(row, `excel-row-${index + 1}`))
    .filter((a: IExternalApplicant) => a.email);
}

function mapRowToApplicant(row: any, id: string): IExternalApplicant {
  // Flexible column mapping - handles various naming conventions
  const firstName = row.firstName || row.first_name || row.FirstName || row["First Name"] || "";
  const lastName = row.lastName || row.last_name || row.LastName || row["Last Name"] || "";
  const email = row.email || row.Email || row.EMAIL || row["E-mail"] || "";
  const phone = row.phone || row.phone_number || row.Phone || row["Phone Number"] || "";
  const headline = row.headline || row.title || row.position || row.Headline || "";
  const resumeUrl = row.resumeUrl || row.resume_url || row.resume || row["Resume URL"] || row["Resume Link"] || "";

  return {
    id,
    firstName,
    lastName,
    email,
    phone,
    headline,
    resumeUrl,
    resumeText: "",
    source: "external",
    rawData: row,
  };
}

export async function fetchAndParseResume(applicant: IExternalApplicant): Promise<ParsedResume | null> {
  try {
    let resumeText = "";

    if (applicant.resumeUrl) {
      // Download and parse PDF from URL
      if (applicant.resumeUrl.endsWith(".pdf")) {
        resumeText = await downloadAndParsePDF(applicant.resumeUrl);
      } else {
        // For non-PDF links, we'll rely on the AI to process whatever content is available
        resumeText = `[Resume available at: ${applicant.resumeUrl}]`;
      }
    }

    // If no resume URL or failed to parse, create minimal data from applicant info
    if (!resumeText) {
      resumeText = `Name: ${applicant.firstName} ${applicant.lastName}
Email: ${applicant.email}
Headline: ${applicant.headline || "Not provided"}`;
    }

    // Use AI to structure the resume text into ParsedResume format
    return await structureResumeWithAI(resumeText, applicant);
  } catch (error) {
    console.error(`Failed to parse resume for ${applicant.email}:`, error);
    return null;
  }
}

async function downloadAndParsePDF(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
    const pdfBuffer = Buffer.from(response.data);
    const parsed = await pdfParse(pdfBuffer);
    return parsed.text;
  } catch (error) {
    console.error("PDF download/parse failed:", error);
    return "";
  }
}

async function structureResumeWithAI(resumeText: string, applicant: IExternalApplicant): Promise<ParsedResume> {
  // Basic extraction - in production, use Gemini to structure this
  // For now, return structured data with raw text as summary
  return {
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    email: applicant.email,
    phone: applicant.phone,
    headline: applicant.headline,
    summary: resumeText.slice(0, 500),
    skills: extractSkills(resumeText),
    experience: extractExperience(resumeText),
    education: extractEducation(resumeText),
    certifications: extractCertifications(resumeText),
  };
}

function extractSkills(text: string): string[] {
  // Simple skill extraction - can be enhanced with AI
  const commonSkills = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust",
    "react", "vue", "angular", "node.js", "express", "django", "flask",
    "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "machine learning", "data science", "ai", "nlp", "computer vision",
    "agile", "scrum", "kanban", "jira",
  ];

  const lowerText = text.toLowerCase();
  return commonSkills.filter(skill => lowerText.includes(skill.toLowerCase()));
}

function extractExperience(text: string): any[] {
  // Placeholder - AI will do proper extraction
  return [];
}

function extractEducation(text: string): any[] {
  // Placeholder - AI will do proper extraction
  return [];
}

function extractCertifications(text: string): string[] {
  // Placeholder - AI will do proper extraction
  return [];
}

export function cleanupUploadedFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to cleanup uploaded file:", error);
  }
}
