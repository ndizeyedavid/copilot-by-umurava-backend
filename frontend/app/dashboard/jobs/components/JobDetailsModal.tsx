"use client";

import React from "react";
import { 
  Building2, 
  MapPin, 
  Clock, 
  Briefcase, 
  DollarSign,
  Globe,
  Users,
  Calendar,
  ChevronLeft,
  Share2,
  CheckCircle2,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Job } from "./JobCard";

interface JobDetailsModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
}

export default function JobDetailsModal({ job, isOpen, onClose, onApply }: JobDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-md border border-gray-50 flex items-center justify-center overflow-hidden shrink-0">
              {job.logo ? (
                <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-[#286ef0]" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#25324B] mb-2">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <p className="text-lg font-bold text-[#286ef0]">{job.company}</p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[#7C8493]">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Side: Job Info */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h3 className="text-xl font-black text-[#25324B] mb-4">Description</h3>
                <p className="text-[#7C8493] leading-relaxed font-medium whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-black text-[#25324B] mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {job.tags.map((tag, i) => (
                    <Badge key={i} className="bg-blue-50 text-[#286ef0] border-none px-5 py-2 text-sm font-bold uppercase tracking-widest rounded-xl">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Side: Quick Stats */}
            <div className="space-y-6">
              <Card className="p-6 bg-[#F8F9FD] border-none shadow-none rounded-3xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-[#286ef0]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold text-[#25324B]">{job.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-[#286ef0]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Salary</p>
                    <p className="text-sm font-bold text-[#25324B]">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-[#286ef0]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posted</p>
                    <p className="text-sm font-bold text-[#25324B]">{job.postedAt}</p>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => onApply(job.id)}
                  className="w-full py-5 bg-[#286ef0] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-100 hover:bg-[#1f5fe0] transition-all flex items-center justify-center gap-3"
                >
                  Apply Now
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <button className="w-full py-5 border-2 border-gray-100 text-[#25324B] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                  Save for Later
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
