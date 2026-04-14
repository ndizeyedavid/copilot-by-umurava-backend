"use client";

import {
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  Mail,
  ExternalLink,
  Phone,
  Award,
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import type { AdminApplicationRow } from "@/app/components/admin/applications/AdminApplicationsTable";

export default function AdminApplicationDetailModal({
  application,
  onClose,
}: {
  application: AdminApplicationRow | null;
  onClose: () => void;
}) {
  if (!application) return null;

  // Mock data representing talent profile based on model
  const talent = {
    bio: "Passionate Senior Frontend Engineer with over 6 years of experience building scalable web applications. Specializing in React, TypeScript, and modern UI architectures.",
    headline: application.talentHeadline,
    location: application.talentLocation,
    skills: [
      { name: "React", level: "Expert", years: 6 },
      { name: "TypeScript", level: "Expert", years: 5 },
      { name: "Next.js", level: "Advanced", years: 3 },
      { name: "Tailwind CSS", level: "Expert", years: 4 },
      { name: "Node.js", level: "Intermediate", years: 2 },
    ],
    experience: [
      {
        company: "Umurava",
        role: "Senior Frontend Engineer",
        startDate: "2022-01-01",
        endDate: null,
        description:
          "Leading the frontend team to build the Copilot by Umurava platform. Architected the component library and improved performance by 40%.",
        technologies: ["React", "Next.js", "TypeScript"],
        isCurrent: true,
      },
      {
        company: "Tech Solutions Inc.",
        role: "Frontend Developer",
        startDate: "2019-06-01",
        endDate: "2021-12-31",
        description:
          "Developed enterprise-grade dashboards for various clients. Mentored junior developers and introduced modern testing practices.",
        technologies: ["React", "Redux", "Sass"],
        isCurrent: false,
      },
    ],
    education: [
      {
        institution: "Carnegie Mellon University Africa",
        degree: "Master of Science",
        field: "Information Technology",
        startYear: "2017",
        endYear: "2019",
      },
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description:
          "Built a custom e-commerce engine with real-time inventory management.",
        link: "https://project.example.com",
      },
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "French", proficiency: "Fluent" },
      { name: "Kinyarwanda", proficiency: "Native" },
    ],
    availability: {
      status: "Available",
      type: "Full-time",
    },
    socialLinks: {
      linkedin: "linkedin.com/in/talenthub",
      github: "github.com/talentdev",
      portfolio: "talent.dev",
    },
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="relative h-full max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm uppercase">
              {application.talentName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#25324B]">
                {application.talentName}
              </h2>
              <p className="text-xs text-[#7C8493]">{talent.headline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Download Resume
            </a>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="h-[calc(90vh-76px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-base font-bold text-[#25324B] mb-3">
                  About Me
                </h3>
                <p className="text-sm leading-6 text-[#7C8493]">{talent.bio}</p>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#25324B] mb-4">
                  Work Experience
                </h3>
                <div className="space-y-6">
                  {talent.experience.map((exp, idx) => (
                    <div key={idx} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                          <Briefcase className="h-5 w-5 text-indigo-600" />
                        </div>
                        {idx !== talent.experience.length - 1 && (
                          <div className="h-full w-px bg-gray-100 mt-2" />
                        )}
                      </div>
                      <div className="pb-6">
                        <h4 className="text-sm font-bold text-[#25324B]">
                          {exp.role}
                        </h4>
                        <p className="text-xs text-[#7C8493] mb-2">
                          {exp.company} • {exp.startDate} -{" "}
                          {exp.endDate || "Present"}
                        </p>
                        <p className="text-sm text-[#7C8493] leading-relaxed">
                          {exp.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#25324B] mb-4">
                  Education
                </h3>
                <div className="space-y-4">
                  {talent.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50"
                    >
                      <GraduationCap className="h-6 w-6 text-indigo-600 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-[#25324B]">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-xs text-[#7C8493]">
                          {edu.institution} • {edu.startYear} - {edu.endYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="rounded-2xl border border-gray-100 bg-gray-50/30 p-5">
                <h3 className="text-base font-bold text-[#25324B] mb-4">
                  Contact & Social
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">{talent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">talent@example.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">+250 788 123 456</span>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <a
                      href="#"
                      className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                    >
                      <FaLinkedin className="h-4 w-4 text-[#0A66C2]" />
                    </a>
                    <a
                      href="#"
                      className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                    >
                      <FaGithub className="h-4 w-4 text-[#181717]" />
                    </a>
                    <a
                      href="#"
                      className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 text-indigo-400" />
                    </a>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#25324B] mb-4">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group relative rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-all cursor-default"
                    >
                      {skill.name}
                      <span className="ml-1 text-[10px] text-indigo-400 font-normal">
                        • {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-base font-bold text-[#25324B] mb-4">
                  Languages
                </h3>
                <div className="space-y-3">
                  {talent.languages.map((lang) => (
                    <div
                      key={lang.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-[#25324B]">
                        {lang.name}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-100">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-[#F8F8FD] p-5 border border-indigo-100/50">
                <div className="flex items-center gap-2 text-indigo-700 mb-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Availability
                  </span>
                </div>
                <p className="text-sm font-bold text-[#25324B]">
                  {talent.availability.type}
                </p>
                <p className="text-xs text-[#7C8493] mt-1">
                  Ready to start immediately
                </p>
              </section>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <h3 className="text-base font-bold text-[#25324B] mb-4">
              Cover Letter
            </h3>
            <div className="rounded-2xl bg-gray-50 p-6">
              <p className="text-sm text-[#7C8493] leading-relaxed whitespace-pre-wrap italic">
                {application.coverLetter || "No cover letter provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
