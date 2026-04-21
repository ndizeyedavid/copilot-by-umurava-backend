"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { stripHtmlToText } from "./SafeHtml";

type ApiJob = {
  _id: string;
  title: string;
  description: string;
  requirements?: string[];
  deadline?: string;
  jobType: string;
  locationType: string;
  status: "open" | "closed" | "draft";
};

const tagColors = [
  "bg-orange-100 text-orange-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-red-100 text-red-600",
];

export default function FeaturedJobsSection() {
  const jobsQuery = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: async () => {
      const res = await api.get("/jobs");
      return (res.data?.jobs ?? []) as ApiJob[];
    },
    staleTime: 60_000,
  });

  const featuredJobs = (jobsQuery.data ?? [])
    .filter((j) => j.status === "open")
    .slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="mx-[122px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-[#25324B]">
            Active <span className="text-[#286ef0]">Job Postings</span>
          </h2>
          <a
            href="/admin/jobs"
            className="flex items-center gap-2 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
          >
            Manage all jobs
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-4 gap-6">
          {jobsQuery.isLoading ? (
            <div className="col-span-4 py-12 text-center text-sm font-semibold text-gray-500">
              Loading jobs...
            </div>
          ) : jobsQuery.isError ? (
            <div className="col-span-4 py-12 text-center text-sm font-semibold text-red-600">
              Failed to load jobs
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="col-span-4 py-12 text-center text-sm font-semibold text-gray-500">
              No active job postings.{" "}
              <a href="/admin/jobs" className="text-[#286ef0] hover:underline">
                Create your first job posting
              </a>
            </div>
          ) : (
            featuredJobs.map((job) => (
              <a
                key={job._id}
                href={`/admin/jobs?jobId=${encodeURIComponent(job._id)}`}
                className="p-6 border border-gray-100 hover:border-[#286ef0] hover:shadow-md transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/companies/dummy.png"
                      alt="Company"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-[#4F46E5] border border-[#4F46E5] rounded">
                    {job.jobType}
                  </span>
                </div>

                {/* Job Info */}
                <h3 className="text-lg font-semibold text-[#25324B] mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{job.locationType}</p>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {stripHtmlToText(job.description)}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(job.requirements ?? []).slice(0, 2).map((req, idx) => (
                    <span
                      key={`${job._id}_${idx}`}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        tagColors[idx % tagColors.length]
                      }`}
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
