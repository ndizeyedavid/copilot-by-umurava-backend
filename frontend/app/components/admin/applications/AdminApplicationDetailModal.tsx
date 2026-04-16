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
  Loader2,
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import type { AdminApplicationRow } from "@/app/components/admin/applications/AdminApplicationsTable";
import { api } from "@/lib/api/client";

type BackendTalent = {
  _id: string;
  headline: string;
  bio?: string;
  location: string;
  skills: { name: string; level: string; yearsOfExperience: number }[];
  languages?: { name: string; proficiency: string }[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologies: string[];
    IsCurrent: boolean;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
  }[];
  projects: {
    name: string;
    description: string;
    link?: string;
  }[];
  availability: {
    status: string;
    type: string;
  };
  socialLinks: string[];
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
};

export default function AdminApplicationDetailModal({
  application,
  onClose,
}: {
  application: AdminApplicationRow | null;
  onClose: () => void;
}) {
  const talentQuery = useQuery({
    queryKey: ["admin", "talent", application?.talentId],
    enabled: !!application?.talentId,
    queryFn: async () => {
      const res = await api.get(`/talents/${application!.talentId}`);
      return res.data?.fetchedTalent as BackendTalent;
    },
  });

  if (!application) return null;

  const talent = talentQuery.data;
  const isLoading = talentQuery.isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
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
              <p className="text-xs text-[#7C8493]">
                {application.talentHeadline}
              </p>
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm text-[#7C8493]">Loading profile...</p>
            </div>
          ) : talent ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-base font-bold text-[#25324B] mb-3">
                    About Me
                  </h3>
                  <p className="text-sm leading-6 text-[#7C8493]">
                    {talent.bio || "No bio provided."}
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-[#25324B] mb-4">
                    Work Experience
                  </h3>
                  <div className="space-y-6">
                    {talent.experience?.length > 0 ? (
                      talent.experience.map((exp, idx) => (
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
                              {exp.company} •{" "}
                              {new Date(exp.startDate).getFullYear()} -{" "}
                              {exp.endDate
                                ? new Date(exp.endDate).getFullYear()
                                : "Present"}
                            </p>
                            <p className="text-sm text-[#7C8493] leading-relaxed">
                              {exp.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {exp.technologies?.map((tech) => (
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
                      ))
                    ) : (
                      <p className="text-sm text-[#7C8493]">
                        No experience listed.
                      </p>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-base font-bold text-[#25324B] mb-4">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {talent.education?.length > 0 ? (
                      talent.education.map((edu, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50"
                        >
                          <GraduationCap className="h-6 w-6 text-indigo-600 shrink-0" />
                          <div>
                            <h4 className="text-sm font-bold text-[#25324B]">
                              {edu.degree} in {edu.fieldOfStudy}
                            </h4>
                            <p className="text-xs text-[#7C8493]">
                              {edu.institution} •{" "}
                              {new Date(edu.startYear).getFullYear()} -{" "}
                              {new Date(edu.endYear).getFullYear()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#7C8493]">
                        No education listed.
                      </p>
                    )}
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
                      <span className="text-gray-600">
                        {talent.userId.email}
                      </span>
                    </div>
                    {talent.userId.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="text-gray-600">
                          {talent.userId.phone}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 flex gap-3">
                      {talent.socialLinks?.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-100 transition-colors"
                        >
                          {link.includes("linkedin") ? (
                            <FaLinkedin className="h-4 w-4 text-[#0A66C2]" />
                          ) : link.includes("github") ? (
                            <FaGithub className="h-4 w-4 text-[#181717]" />
                          ) : (
                            <ExternalLink className="h-4 w-4 text-indigo-400" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-base font-bold text-[#25324B] mb-4">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills?.map((skill) => (
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
                    {talent.languages?.map((lang) => (
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
                    {talent.availability.status}
                  </p>
                </section>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-[#7C8493]">
                Talent profile not found.
              </p>
            </div>
          )}

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
