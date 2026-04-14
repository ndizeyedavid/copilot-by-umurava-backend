"use client";

import { useState } from "react";
import { Search, Filter, Briefcase, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

type JobSummary = {
  id: string;
  title: string;
  company: string;
  applicants: number;
  status: "Open" | "Closed";
  postedAt: string;
};

export default function AdminApplicationsJobPicker() {
  const [query, setQuery] = useState("");

  const jobs: JobSummary[] = [
    {
      id: "job_1",
      title: "Senior Frontend Engineer",
      company: "Umurava",
      applicants: 48,
      status: "Open",
      postedAt: "2d ago",
    },
    {
      id: "job_2",
      title: "Product Designer",
      company: "Copilot Team",
      applicants: 31,
      status: "Open",
      postedAt: "5d ago",
    },
    {
      id: "job_3",
      title: "Backend Developer",
      company: "TechCorp Solutions",
      applicants: 64,
      status: "Open",
      postedAt: "1w ago",
    },
    {
      id: "job_4",
      title: "Data Analyst",
      company: "Digital Innovations",
      applicants: 92,
      status: "Closed",
      postedAt: "3w ago",
    },
  ];

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#25324B]">Applications</h1>
        <p className="text-sm text-[#7C8493]">Select a job to manage its candidates</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#286ef0]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((job) => (
          <Link
            key={job.id}
            href={`/admin/jobs/${job.id}/applications`}
            className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#286ef0] hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-[#25324B] group-hover:text-[#286ef0]">
                  {job.title}
                </p>
                <p className="text-sm text-[#7C8493]">{job.company}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  job.status === "Open"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#25324B]">
                  <Users className="h-4 w-4 text-[#7C8493]" />
                  {job.applicants}
                </div>
                <div className="text-xs text-[#7C8493]">Posted {job.postedAt}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#286ef0]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
