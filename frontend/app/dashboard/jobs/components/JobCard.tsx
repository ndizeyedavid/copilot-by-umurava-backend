"use client";

import React from "react";
import { 
  Building2, 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign, 
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  postedAt: string;
  description: string;
  tags: string[];
  status?: "Open" | "Closed" | "Applied";
}

interface JobCardProps {
  job: Job;
  onClick: (id: string) => void;
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card 
      className="group relative bg-white border border-gray-100 rounded-[20px] p-6 hover:shadow-[0_20px_50px_rgba(40,110,240,0.1)] hover:border-[#286ef0] transition-all duration-500 cursor-pointer"
      onClick={() => onClick(job.id)}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F9FD] border border-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-7 h-7 text-[#286ef0]" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#25324B] group-hover:text-[#286ef0] transition-colors leading-tight">
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-[#7C8493] mt-1">{job.company}</p>
          </div>
        </div>
        <button className="p-2 text-gray-300 hover:text-[#286ef0] hover:bg-blue-50 rounded-xl transition-all">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-y-3 gap-x-6 mb-6">
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#444]">
          <MapPin className="w-4 h-4 text-gray-400" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#444]">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {job.type}
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#444]">
          <DollarSign className="w-4 h-4 text-gray-400" />
          {job.salary}
        </div>
        <div className="flex items-center gap-2 text-[13px] font-medium text-[#7C8493]">
          <Clock className="w-4 h-4 text-gray-400" />
          {job.postedAt}
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-gray-50">
        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} className="bg-[#F8F9FD] text-[#444] border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <span className="text-[11px] font-bold text-gray-400 flex items-center">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-[#286ef0] opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
          View Details
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      
      {job.status === "Applied" && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-4 border-white">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
    </Card>
  );
}
