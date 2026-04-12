import mongoose from "mongoose";
import Jobs from "./models/jobs.model";
import Talent from "./models/talents.model";
import Screening from "./models/screening.model";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/copilot";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Jobs.deleteMany({});
    await Talent.deleteMany({});
    await Screening.deleteMany({});
    console.log("Cleared existing data");

    // Seed Jobs
    const jobs = await Jobs.create([
      {
        title: "Senior Full-Stack Developer",
        description: "We're looking for an experienced full-stack developer to lead our product team. You'll work with React, Node.js, and AWS to build scalable web applications.",
        requirements: [
          "5+ years experience with React and modern JavaScript",
          "3+ years experience with Node.js and Express",
          "Experience with AWS services (Lambda, S3, DynamoDB)",
          "Strong understanding of database design and optimization",
          "Experience with CI/CD pipelines",
          "Bachelor's degree in Computer Science or equivalent",
        ],
        weights: {
          skills: 0.4,
          experience: 0.35,
          education: 0.25,
        },
      },
      {
        title: "DevOps Engineer",
        description: "Join our infrastructure team to build and maintain scalable cloud infrastructure. You'll work with Kubernetes, Terraform, and major cloud providers.",
        requirements: [
          "3+ years experience with AWS or Azure",
          "Strong Kubernetes and Docker experience",
          "Infrastructure as Code (Terraform, CloudFormation)",
          "CI/CD pipeline management",
          "Scripting skills (Python, Bash, Go)",
          "Experience with monitoring tools (Datadog, Prometheus)",
        ],
        weights: {
          skills: 0.45,
          experience: 0.4,
          education: 0.15,
        },
      },
      {
        title: "Mobile App Developer (React Native)",
        description: "Build cross-platform mobile applications for iOS and Android using React Native. Work on consumer-facing apps with millions of users.",
        requirements: [
          "3+ years React Native development",
          "Published apps on App Store and Play Store",
          "Experience with native module development",
          "Understanding of mobile UI/UX principles",
          "Experience with Redux or similar state management",
          "Knowledge of push notifications and deep linking",
        ],
        weights: {
          skills: 0.5,
          experience: 0.3,
          education: 0.2,
        },
      },
    ]);
    console.log(`Seeded ${jobs.length} jobs`);

    // Seed Talents
    const talents = await Talent.create([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        headline: "Senior Full-Stack Engineer | React | Node.js | AWS",
        bio: "Passionate full-stack developer with 6 years of experience building scalable web applications. Expert in React ecosystem and cloud architecture.",
        location: "San Francisco, CA",
        skills: [
          { name: "React", level: "Expert", yearsOfExperience: 6 },
          { name: "Node.js", level: "Expert", yearsOfExperience: 5 },
          { name: "TypeScript", level: "Advanced", yearsOfExperience: 4 },
          { name: "AWS", level: "Advanced", yearsOfExperience: 3 },
          { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 5 },
          { name: "GraphQL", level: "Intermediate", yearsOfExperience: 2 },
        ],
        languages: [
          { name: "English", proficiency: "Native" },
          { name: "Spanish", proficiency: "Conversational" },
        ],
        experience: [
          {
            company: "TechCorp Inc.",
            role: "Senior Full-Stack Developer",
            startDate: new Date("2021-03-01"),
            description: "Led team of 5 developers. Built microservices architecture serving 1M+ users.",
            technologies: ["React", "Node.js", "AWS", "Docker", "Kubernetes"],
            IsCurrent: true,
          },
          {
            company: "StartupXYZ",
            role: "Full-Stack Developer",
            startDate: new Date("2019-06-01"),
            endDate: new Date("2021-02-28"),
            description: "Full-stack development for e-commerce platform. Implemented payment processing and inventory management.",
            technologies: ["React", "Express", "MongoDB", "Stripe API"],
            IsCurrent: false,
          },
        ],
        education: [
          {
            institution: "University of California, Berkeley",
            degree: "Bachelor of Science",
            fieldOfStudy: "Computer Science",
            startYear: new Date("2015-09-01"),
            endYear: new Date("2019-05-15"),
          },
        ],
        certifications: [
          { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", issueDate: new Date("2022-08-15") },
          { name: "MongoDB Certified Developer", issuer: "MongoDB Inc.", issueDate: new Date("2021-03-20") },
        ],
        projects: [
          {
            name: "E-commerce Platform",
            description: "Built full-stack e-commerce solution with real-time inventory",
            technologies: ["React", "Node.js", "Socket.io", "Redis"],
            role: "Lead Developer",
            startDate: new Date("2022-01-01"),
          },
        ],
        availability: {
          status: "Available",
          type: "Full-time",
          startDate: new Date("2024-05-01"),
        },
        socialLinks: ["https://linkedin.com/in/johndoe", "https://github.com/johndoe"],
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@email.com",
        headline: "DevOps Engineer | Kubernetes | AWS | Terraform",
        bio: "DevOps specialist focused on cloud infrastructure and automation. 4 years experience building CI/CD pipelines and managing Kubernetes clusters.",
        location: "Seattle, WA",
        skills: [
          { name: "Kubernetes", level: "Expert", yearsOfExperience: 4 },
          { name: "AWS", level: "Expert", yearsOfExperience: 5 },
          { name: "Terraform", level: "Advanced", yearsOfExperience: 3 },
          { name: "Docker", level: "Expert", yearsOfExperience: 5 },
          { name: "Python", level: "Advanced", yearsOfExperience: 4 },
          { name: "Jenkins", level: "Advanced", yearsOfExperience: 3 },
        ],
        languages: [
          { name: "English", proficiency: "Native" },
        ],
        experience: [
          {
            company: "CloudTech Solutions",
            role: "Senior DevOps Engineer",
            startDate: new Date("2022-01-15"),
            description: "Manage Kubernetes clusters across 3 regions. Reduced deployment time by 70% through CI/CD optimization.",
            technologies: ["Kubernetes", "AWS", "Terraform", "GitLab CI", "Prometheus"],
            IsCurrent: true,
          },
          {
            company: "DataSystems Inc.",
            role: "DevOps Engineer",
            startDate: new Date("2020-03-01"),
            endDate: new Date("2022-01-10"),
            description: "Migrated on-premise infrastructure to AWS. Implemented Infrastructure as Code practices.",
            technologies: ["AWS", "CloudFormation", "Python", "Bash"],
            IsCurrent: false,
          },
        ],
        education: [
          {
            institution: "University of Washington",
            degree: "Bachelor of Science",
            fieldOfStudy: "Information Technology",
            startYear: new Date("2016-09-01"),
            endYear: new Date("2020-05-15"),
          },
        ],
        certifications: [
          { name: "AWS Certified DevOps Engineer", issuer: "Amazon Web Services", issueDate: new Date("2023-02-10") },
          { name: "CKA - Certified Kubernetes Administrator", issuer: "CNCF", issueDate: new Date("2022-06-20") },
        ],
        projects: [
          {
            name: "Multi-Region K8s Deployment",
            description: "Designed and deployed Kubernetes clusters across US, EU, and APAC regions",
            technologies: ["Kubernetes", "Terraform", "AWS", "ArgoCD"],
            role: "Lead DevOps Engineer",
            startDate: new Date("2023-01-01"),
          },
        ],
        availability: {
          status: "Open",
          type: "Full-time",
          startDate: new Date("2024-04-15"),
        },
        socialLinks: ["https://linkedin.com/in/janesmith"],
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@email.com",
        headline: "React Native Developer | iOS | Android | Mobile UX",
        bio: "Mobile developer with 4 years experience building cross-platform apps. Passionate about mobile UI/UX and performance optimization.",
        location: "New York, NY",
        skills: [
          { name: "React Native", level: "Advanced", yearsOfExperience: 4 },
          { name: "JavaScript", level: "Expert", yearsOfExperience: 6 },
          { name: "iOS Development", level: "Intermediate", yearsOfExperience: 2 },
          { name: "Android Development", level: "Intermediate", yearsOfExperience: 2 },
          { name: "Redux", level: "Advanced", yearsOfExperience: 3 },
          { name: "TypeScript", level: "Intermediate", yearsOfExperience: 2 },
        ],
        languages: [
          { name: "English", proficiency: "Fluent" },
          { name: "Mandarin", proficiency: "Native" },
        ],
        experience: [
          {
            company: "MobileFirst Apps",
            role: "React Native Developer",
            startDate: new Date("2021-06-01"),
            description: "Developed 3 consumer apps with 500K+ downloads. Implemented real-time features using WebSockets.",
            technologies: ["React Native", "Redux", "Firebase", "OneSignal"],
            IsCurrent: true,
          },
          {
            company: "WebStudio Co.",
            role: "Frontend Developer",
            startDate: new Date("2019-01-15"),
            endDate: new Date("2021-05-30"),
            description: "Built responsive web applications. Transitioned to mobile development mid-way.",
            technologies: ["React", "CSS3", "Webpack"],
            IsCurrent: false,
          },
        ],
        education: [
          {
            institution: "New York University",
            degree: "Bachelor of Arts",
            fieldOfStudy: "Computer Science",
            startYear: new Date("2015-09-01"),
            endYear: new Date("2019-05-15"),
          },
        ],
        certifications: [
          { name: "React Native Certification", issuer: "Meta", issueDate: new Date("2022-08-01") },
        ],
        projects: [
          {
            name: "Fitness Tracker App",
            description: "Cross-platform fitness app with social features and workout tracking",
            technologies: ["React Native", "HealthKit", "Google Fit", "Node.js"],
            role: "Mobile Developer",
            link: "https://apps.apple.com/fitnesstracker",
            startDate: new Date("2022-03-01"),
          },
        ],
        availability: {
          status: "Available",
          type: "Full-time",
          startDate: new Date("2024-05-15"),
        },
        socialLinks: ["https://linkedin.com/in/michaelchen", "https://github.com/mchen"],
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@email.com",
        headline: "Backend Engineer | Node.js | Python | PostgreSQL",
        bio: "Backend-focused developer with strong database skills. 5 years building APIs and microservices.",
        location: "Austin, TX",
        skills: [
          { name: "Node.js", level: "Expert", yearsOfExperience: 5 },
          { name: "Python", level: "Advanced", yearsOfExperience: 4 },
          { name: "PostgreSQL", level: "Expert", yearsOfExperience: 5 },
          { name: "MongoDB", level: "Advanced", yearsOfExperience: 3 },
          { name: "Redis", level: "Intermediate", yearsOfExperience: 2 },
          { name: "GraphQL", level: "Intermediate", yearsOfExperience: 2 },
        ],
        languages: [
          { name: "English", proficiency: "Native" },
        ],
        experience: [
          {
            company: "DataFlow Systems",
            role: "Senior Backend Engineer",
            startDate: new Date("2020-08-01"),
            description: "Design and implement RESTful APIs and microservices. Database optimization and query tuning.",
            technologies: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"],
            IsCurrent: true,
          },
        ],
        education: [
          {
            institution: "University of Texas at Austin",
            degree: "Bachelor of Science",
            fieldOfStudy: "Computer Science",
            startYear: new Date("2015-08-01"),
            endYear: new Date("2019-05-15"),
          },
        ],
        certifications: [],
        projects: [
          {
            name: "Real-time Data Pipeline",
            description: "Built event-driven data processing pipeline handling 10M+ events/day",
            technologies: ["Node.js", "Kafka", "PostgreSQL", "Redis"],
            role: "Backend Lead",
            startDate: new Date("2022-06-01"),
          },
        ],
        availability: {
          status: "Open",
          type: "Full-time",
          startDate: new Date("2024-06-01"),
        },
        socialLinks: ["https://linkedin.com/in/sarahjohnson"],
      },
    ]);
    console.log(`Seeded ${talents.length} talents`);

    // Create a sample screening result for demo purposes
    const sampleScreening = await Screening.create({
      jobId: jobs[0]._id.toString(),
      candidates: [
        {
          candidateId: talents[0]._id.toString(),
          rank: 1,
          matchScore: 95,
          confidence: "high",
          strengths: [
            "6 years React experience exceeds 5yr requirement",
            "Expert-level Node.js skills",
            "AWS certification validates cloud expertise",
            "Full-stack leadership experience",
          ],
          gaps: ["No explicit CI/CD pipeline management mentioned"],
          reasoning: "Exceptional match for Senior Full-Stack role. Strong React/Node background with AWS expertise. Leadership experience is a bonus.",
          finalRecommendation: "Strong hire",
        },
        {
          candidateId: talents[3]._id.toString(),
          rank: 2,
          matchScore: 68,
          confidence: "medium",
          strengths: [
            "Expert Node.js skills",
            "Strong database optimization experience",
            "5+ years backend development",
          ],
          gaps: [
            "Limited React/frontend experience",
            "No AWS cloud experience listed",
            "No full-stack project examples",
          ],
          reasoning: "Strong backend developer but lacks frontend skills required for full-stack role. Would need React upskilling.",
          finalRecommendation: "Consider",
        },
      ],
      comparisonSummary: "John Doe is the clear top candidate with comprehensive full-stack skills. Sarah Johnson is backend-focused and would require additional frontend training.",
    });
    console.log("Created sample screening result");

    console.log("\n=== Seed Complete ===");
    console.log(`Jobs: ${jobs.length}`);
    console.log(`Talents: ${talents.length}`);
    console.log(`Screenings: 1`);
    console.log("\nJob IDs for testing:");
    jobs.forEach((job, i) => console.log(`  [${i + 1}] ${job.title}: ${job._id}`));
    console.log("\nTalent IDs for testing:");
    talents.forEach((talent, i) => console.log(`  [${i + 1}] ${talent.firstName} ${talent.lastName}: ${talent._id}`));

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
