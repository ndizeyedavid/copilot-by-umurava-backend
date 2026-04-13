"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  FileText,
  Timer,
  XCircle,
} from "lucide-react";

import DashboardRightSidebar from "@/app/components/dashboard/DashboardRightSidebar";
import DashboardStats from "@/app/components/dashboard/DashboardStats";
import JobRecommendations from "@/app/components/dashboard/JobRecommendations";

type StatCard = {
  label: string;
  value: number;
  icon: ReactNode;
  className: string;
};

type Job = {
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  daysLeft: number;
  mode: string;
};

type Deadline = {
  name: string;
  company: string;
  time: string;
  avatar: string;
};

export default function DashboardPage() {
  const stats: StatCard[] = [
    {
      label: "Total Jobs",
      value: 54,
      icon: <Briefcase className="h-6 w-6 text-white/90" />,
      className: "bg-[#2F6FED]",
    },
    {
      label: "Applications",
      value: 14,
      icon: <FileText className="h-6 w-6 text-white/90" />,
      className: "bg-[#0B1324]",
    },
    {
      label: "Rejected",
      value: 1,
      icon: <XCircle className="h-6 w-6 text-white/90" />,
      className: "bg-[#ff3333]",
    },
    {
      label: "Accepted",
      value: 6,
      icon: <CheckCircle2 className="h-6 w-6 text-white/90" />,
      className: "bg-[#20C46A]",
    },
  ];

  const jobs: Job[] = [
    {
      title: "Data Analyst, IT",
      company: "Umurava",
      description:
        "Looking for a Data Analyst who will be delivering several projects for our partner organizations in various fields.",
      location: "Rwanda",
      type: "Fulltime",
      daysLeft: 7,
      mode: "On Site",
    },
    {
      title: "Product Designer",
      company: "Umurava",
      description:
        "Help design end-to-end experiences from discovery to delivery. Work closely with engineering and product.",
      location: "Rwanda",
      type: "Fulltime",
      daysLeft: 5,
      mode: "Hybrid",
    },
    {
      title: "Backend Engineer",
      company: "Umurava",
      description:
        "Build scalable APIs and systems. Strong TypeScript and Node.js background required.",
      location: "Rwanda",
      type: "Fulltime",
      daysLeft: 10,
      mode: "Remote",
    },
    {
      title: "AI/ML Engineer",
      company: "Umurava",
      description:
        "Work on applied machine learning features and evaluation. Experience with embeddings and LLM tooling a plus.",
      location: "Rwanda",
      type: "Contract",
      daysLeft: 3,
      mode: "Remote",
    },
  ];

  const deadlines: Deadline[] = [
    {
      name: "Fullstack Developer",
      company: "Umurava",
      time: "4/13/2026",
      avatar: "/images/companies/umurava.png",
    },
    {
      name: "AI / ML Engineer",
      company: "Umurava",
      time: "4/13/2026",
      avatar: "/images/companies/umurava.png",
    },
    {
      name: "Devops Engineer",
      company: "Umurava",
      time: "4/13/2026",
      avatar: "/images/companies/umurava.png",
    },
  ];

  return (
    <div className="grid grid-cols-[1fr_320px] gap-3">
      <div className="space-y-8">
        <DashboardStats stats={stats} />
        <JobRecommendations jobs={jobs} />
      </div>

      <DashboardRightSidebar deadlines={deadlines} />
    </div>
  );
}
