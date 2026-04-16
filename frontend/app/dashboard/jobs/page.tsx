"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import JobCard, { Job } from "./components/JobCard";
import JobDetailsModal from "./components/JobDetailsModal";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // Mock Jobs Data
  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      company: "Umurava",
      location: "Kigali, Rwanda",
      type: "Full-time",
      salary: "$2,500 - $4,000",
      postedAt: "2 hours ago",
      description: "We are looking for a Senior Full Stack Developer to join our core team. You will be responsible for building scalable web applications and leading a team of junior developers.\n\nRequirements:\n- 5+ years of experience with React and Node.js\n- Strong understanding of system architecture\n- Experience with AWS and DevOps practices",
      tags: ["React", "Node.js", "AWS", "TypeScript"],
      status: "Open"
    },
    {
      id: "2",
      title: "UI/UX Product Designer",
      company: "Copilot Team",
      location: "Remote",
      type: "Contract",
      salary: "$1,800 - $3,000",
      postedAt: "5 hours ago",
      description: "Join us in designing the future of AI-driven recruitment tools. We need a designer who can translate complex data into simple, intuitive user interfaces.",
      tags: ["Figma", "UI Design", "User Research", "Prototyping"],
      status: "Applied"
    },
    {
      id: "3",
      title: "Backend Engineer (Go/Python)",
      company: "TechCorp Global",
      location: "Kigali, Rwanda",
      type: "Full-time",
      salary: "$3,000 - $5,000",
      postedAt: "1 day ago",
      description: "Develop high-performance microservices and API infrastructures for our global clients. You will work on massive datasets and high-concurrency systems.",
      tags: ["Go", "Python", "PostgreSQL", "Redis"],
      status: "Open"
    },
    {
      id: "4",
      title: "Frontend Developer (Next.js)",
      company: "Innovation Hub",
      location: "Kigali, Rwanda",
      type: "Part-time",
      salary: "$1,000 - $1,500",
      postedAt: "3 days ago",
      description: "Help us build blazing-fast frontend applications using Next.js and Tailwind CSS. Focus on performance and accessibility.",
      tags: ["Next.js", "Tailwind CSS", "React"],
      status: "Open"
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudScale",
      location: "Remote",
      type: "Full-time",
      salary: "$4,000 - $6,500",
      postedAt: "4 days ago",
      description: "Scale our infrastructure to handle millions of requests. Master of Kubernetes, Docker, and CI/CD pipelines.",
      tags: ["Kubernetes", "Docker", "Terraform", "CI/CD"],
      status: "Open"
    },
    {
      id: "6",
      title: "Mobile App Developer",
      company: "AppMasters",
      location: "Kigali, Rwanda",
      type: "Contract",
      salary: "$2,000 - $3,500",
      postedAt: "1 week ago",
      description: "Build cross-platform mobile applications using Flutter. Experience with mobile payments integration is a plus.",
      tags: ["Flutter", "Dart", "Firebase"],
      status: "Open"
    }
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleJobClick = (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (job) {
      setSelectedJob(job);
      setIsModalOpen(true);
    }
  };

  const handleApply = (id: string) => {
    console.log("Applying for job:", id);
    // Add real application logic here
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#25324B] tracking-tight">Available Jobs</h1>
            <p className="text-lg font-semibold text-[#7C8493] mt-2">Find your next big opportunity today</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewType("grid")}
              className={`p-3 rounded-2xl transition-all ${viewType === "grid" ? "bg-[#286ef0] text-white shadow-lg shadow-blue-100" : "bg-white text-gray-400 hover:text-[#286ef0] shadow-sm"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewType("list")}
              className={`p-3 rounded-2xl transition-all ${viewType === "list" ? "bg-[#286ef0] text-white shadow-lg shadow-blue-100" : "bg-white text-gray-400 hover:text-[#286ef0] shadow-sm"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4 bg-white border border-gray-100 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#286ef0] transition-colors" />
              <input 
                type="text"
                placeholder="Search job titles, companies, or skills..."
                className="w-full pl-14 pr-6 py-5 bg-[#F8F9FD] rounded-2xl border-none focus:ring-2 focus:ring-[#286ef0] font-semibold text-[#25324B] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-[#25324B] hover:border-[#286ef0] hover:text-[#286ef0] transition-all uppercase tracking-widest text-xs">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-[#286ef0] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-[#1f5fe0] transition-all">
                Search
              </button>
            </div>
          </div>
        </Card>

        {/* Jobs Grid/List */}
        <div className={viewType === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={handleJobClick} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-[#25324B]">No jobs found</h3>
              <p className="text-[#7C8493] font-semibold mt-2">Try adjusting your search query or filters</p>
            </div>
          )}
        </div>

        {/* Dynamic Modal */}
        {selectedJob && (
          <JobDetailsModal 
            job={selectedJob} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onApply={handleApply}
          />
        )}
      </div>
    </div>
  );
}
