"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  LayoutList,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import ApplicationCard, { Application } from "./components/ApplicationCard";
import ApplicationDetailModal from "./components/ApplicationDetailModal";

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Past">("All");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applications: Application[] = [
    {
      id: "1",
      jobTitle: "Senior Full Stack Developer",
      company: "Umurava",
      location: "Kigali, Rwanda",
      type: "Full-time",
      appliedDate: "Jan 12, 2024",
      status: "Shortlisted",
      nextStep: "Technical Interview - Jan 25",
    },
    {
      id: "2",
      jobTitle: "UI/UX Product Designer",
      company: "Copilot Team",
      location: "Remote",
      type: "Contract",
      appliedDate: "Jan 10, 2024",
      status: "Reviewing",
    },
    {
      id: "3",
      jobTitle: "Backend Engineer (Go/Python)",
      company: "TechCorp Global",
      location: "Kigali, Rwanda",
      type: "Full-time",
      appliedDate: "Dec 28, 2023",
      status: "Rejected",
    },
    {
      id: "4",
      jobTitle: "Frontend Developer (Next.js)",
      company: "Innovation Hub",
      location: "Kigali, Rwanda",
      type: "Part-time",
      appliedDate: "Dec 15, 2023",
      status: "Interviewing",
      nextStep: "CEO Coffee Chat",
    },
    {
      id: "5",
      jobTitle: "DevOps Engineer",
      company: "CloudScale",
      location: "Remote",
      type: "Full-time",
      appliedDate: "Nov 22, 2023",
      status: "Offered",
    },
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase());

      const isActive = ["Reviewing", "Shortlisted", "Interviewing"].includes(
        app.status,
      );
      const isPast = ["Rejected", "Offered"].includes(app.status);

      if (activeTab === "Active") return matchesSearch && isActive;
      if (activeTab === "Past") return matchesSearch && isPast;
      return matchesSearch;
    });
  }, [searchQuery, activeTab]);

  const stats = {
    total: applications.length,
    active: applications.filter((a) =>
      ["Reviewing", "Shortlisted", "Interviewing"].includes(a.status),
    ).length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const handleApplicationClick = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (app) {
      setSelectedApplication(app);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#25324B] tracking-tight">
              My Applications
            </h1>
            <p className="text-lg font-semibold text-[#7C8493] mt-2">
              Track your progress and upcoming interviews
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-50">
              {(["All", "Active", "Past"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[#286ef0] text-white shadow-md shadow-blue-100"
                      : "text-[#7C8493] hover:text-[#286ef0] hover:bg-blue-50/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#286ef0]">
              <LayoutList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Total
              </p>
              <p className="text-2xl font-black text-[#25324B]">
                {stats.total}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Active
              </p>
              <p className="text-2xl font-black text-[#25324B]">
                {stats.active}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Shortlisted
              </p>
              <p className="text-2xl font-black text-[#25324B]">
                {stats.shortlisted}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Rejected
              </p>
              <p className="text-2xl font-black text-[#25324B]">
                {stats.rejected}
              </p>
            </div>
          </Card>
        </div>

        {/* Search & Search Content */}
        <div className="space-y-6">
          <Card className="p-4 bg-white border border-gray-100 rounded-[24px] shadow-sm">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#286ef0] transition-colors" />
              <input
                type="text"
                placeholder="Filter by job title or company..."
                className="w-full pl-14 pr-6 py-4 bg-[#F8F9FD] rounded-2xl border-none focus:ring-2 focus:ring-[#286ef0] font-semibold text-[#25324B] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>

          <div className="space-y-6">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onClick={handleApplicationClick}
                />
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-[#25324B]">
                  No applications found
                </h3>
                <p className="text-[#7C8493] font-semibold mt-2">
                  You haven't applied to any jobs in this category yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Modal */}
        {selectedApplication && (
          <ApplicationDetailModal
            application={selectedApplication}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
