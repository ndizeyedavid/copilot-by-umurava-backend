"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MapPin,
  Briefcase,
  Users,
  BadgeDollarSign,
  ShieldCheck,
} from "lucide-react";

type JobDetails = {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  benefits: string[];
  weights: { skills: number; experience: number; education: number };
  deadline: string;
  jobType: "full-time" | "part-time";
  locationType: "on-site" | "hybrid" | "remote";
  salary: { amount: number; currency: "USD" | "RWF" };
  stats: { applicants: number; views: number; postedAt: string };
  status: "Open" | "Closed" | "Draft";
  locationLabel: string;
};

function badgeClasses(status: JobDetails["status"]) {
  if (status === "Open") return "border-green-200 bg-green-100 text-green-700";
  if (status === "Closed") return "border-gray-200 bg-gray-100 text-gray-700";
  return "border-amber-200 bg-amber-100 text-amber-700";
}

export default function AdminJobDetailsPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId ?? "";

  const job: JobDetails = {
    id: jobId,
    title: "Senior Frontend Engineer",
    company: "Umurava",
    description:
      "We are looking for a senior frontend engineer to build high-quality user experiences across our platform. You'll collaborate with product, design, and backend teams to ship features end-to-end.",
    requirements: [
      "3+ years React experience",
      "Strong TypeScript skills",
      "Solid understanding of UI architecture and accessibility",
      "Experience with REST APIs",
    ],
    benefits: ["Health insurance", "Remote-friendly", "Learning budget"],
    weights: { skills: 40, experience: 35, education: 25 },
    deadline: "2026-04-20",
    jobType: "full-time",
    locationType: "remote",
    salary: { amount: 2500, currency: "USD" },
    stats: { applicants: 48, views: 312, postedAt: "2026-04-10" },
    status: "Open",
    locationLabel: "Kigali, Rwanda",
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#286ef0]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="text-2xl font-bold text-[#25324B]">{job.title}</p>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses(job.status)}`}
              >
                {job.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#7C8493]">{job.company}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-[#25324B]">
                <MapPin className="h-3.5 w-3.5 text-[#7C8493]" />
                {job.locationType}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-[#25324B]">
                <Briefcase className="h-3.5 w-3.5 text-[#7C8493]" />
                {job.jobType}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-[#25324B]">
                <CalendarDays className="h-3.5 w-3.5 text-[#7C8493]" />
                Deadline: {job.deadline}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/jobs/${jobId}/screening`}
              className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-[#286ef0] hover:bg-blue-100 transition-colors"
            >
              Start AI Screening
            </Link>
            <button className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-[#25324B] hover:bg-gray-50">
              Edit job
            </button>
            <Link
              href={`/admin/jobs/${jobId}/applications`}
              className="rounded-xl bg-[#286ef0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1f5fe0]"
            >
              View applications
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-[#F8F8FD] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C8493]">
              <Users className="h-4 w-4" />
              Applicants
            </div>
            <p className="mt-2 text-2xl font-bold text-[#25324B]">
              {job.stats.applicants}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F8FD] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C8493]">
              <Eye className="h-4 w-4" />
              Views
            </div>
            <p className="mt-2 text-2xl font-bold text-[#25324B]">
              {job.stats.views}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F8FD] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C8493]">
              <BadgeDollarSign className="h-4 w-4" />
              Salary
            </div>
            <p className="mt-2 text-2xl font-bold text-[#25324B]">
              {job.salary.amount} {job.salary.currency}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-[#F8F8FD] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7C8493]">
              <ShieldCheck className="h-4 w-4" />
              Weights
            </div>
            <p className="mt-2 text-sm font-semibold text-[#25324B]">
              Skills {job.weights.skills}% • Exp {job.weights.experience}% • Edu{" "}
              {job.weights.education}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-[#25324B]">Description</p>
            <p className="mt-3 text-sm leading-6 text-[#25324B]">
              {job.description}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-[#25324B]">Requirements</p>
            <div className="mt-4 space-y-2">
              {job.requirements.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-[#F8F8FD] px-4 py-3 text-sm text-[#25324B]"
                >
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-[#25324B]">Benefits</p>
            <div className="mt-4 space-y-2">
              {job.benefits.length ? (
                job.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 bg-[#F8F8FD] px-4 py-3 text-sm text-[#25324B]"
                  >
                    {b}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#7C8493]">No benefits listed.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-[#25324B]">Meta</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#7C8493]">Job ID</span>
                <span className="font-semibold text-[#25324B]">{job.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7C8493]">Posted</span>
                <span className="font-semibold text-[#25324B]">
                  {job.stats.postedAt}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7C8493]">Location label</span>
                <span className="font-semibold text-[#25324B]">
                  {job.locationLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
