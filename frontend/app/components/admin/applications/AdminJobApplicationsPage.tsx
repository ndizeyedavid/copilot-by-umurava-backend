"use client";

import { useState } from "react";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";
import Link from "next/link";
import AdminApplicationsTable, {
  type AdminApplicationRow,
} from "@/app/components/admin/applications/AdminApplicationsTable";
import AdminApplicationDetailModal from "@/app/components/admin/applications/AdminApplicationDetailModal";

export default function AdminJobApplicationsPage({ jobId }: { jobId: string }) {
  const [query, setQuery] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<AdminApplicationRow | null>(null);

  // Mock data for applications
  const applications: AdminApplicationRow[] = [
    {
      id: "app_1",
      talentName: "Justin Lipshutz",
      talentHeadline: "Senior Product Designer",
      talentLocation: "New York, USA",
      status: "shortlisted",
      appliedDate: "2026-04-12",
      resumeUrl: "#",
      coverLetter: "I am very interested in this position because...",
    },
    {
      id: "app_2",
      talentName: "Marcus Culhane",
      talentHeadline: "Frontend Engineer",
      talentLocation: "London, UK",
      status: "reviewing",
      appliedDate: "2026-04-13",
      resumeUrl: "#",
      coverLetter: "I have been working with React for 5 years...",
    },
    {
      id: "app_3",
      talentName: "Leo Stanton",
      talentHeadline: "Data Analyst",
      talentLocation: "Berlin, Germany",
      status: "rejected",
      appliedDate: "2026-04-10",
      resumeUrl: "#",
    },
    {
      id: "app_4",
      talentName: "Avery Davis",
      talentHeadline: "Fullstack Developer",
      talentLocation: "San Francisco, USA",
      status: "hired",
      appliedDate: "2026-04-05",
      resumeUrl: "#",
    },
    {
      id: "app_5",
      talentName: "Sofia Rodriguez",
      talentHeadline: "UX Researcher",
      talentLocation: "Madrid, Spain",
      status: "pending",
      appliedDate: "2026-04-14",
      resumeUrl: "#",
    },
  ];

  const filteredApplications = applications.filter(
    (app) =>
      app.talentName.toLowerCase().includes(query.toLowerCase()) ||
      app.talentHeadline.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={`/admin/jobs/${jobId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#286ef0] hover:underline mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Details
          </Link>
          <h1 className="text-2xl font-bold text-[#25324B]">Applications</h1>
          <p className="text-sm text-[#7C8493]">
            Managing candidates for <span className="font-semibold text-[#25324B]">Senior Frontend Engineer</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#25324B] hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or headline..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#25324B] hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 text-gray-400" />
            Filters
          </button>
          <div className="h-8 w-px bg-gray-100 hidden md:block" />
          <p className="text-sm font-medium text-[#25324B]">
            {filteredApplications.length} Candidates
          </p>
        </div>
      </div>

      {/* Table */}
      <AdminApplicationsTable
        rows={filteredApplications}
        onViewDetails={(app) => setSelectedApplication(app)}
      />

      {/* Detail Modal */}
      <AdminApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
}
