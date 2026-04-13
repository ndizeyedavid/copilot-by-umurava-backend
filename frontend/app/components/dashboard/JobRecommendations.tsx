import Image from "next/image";
import { Briefcase, CalendarDays, Filter, MapPin, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";

type Job = {
  title: string;
  company: string;
  description: string;
  location: string;
  type: string;
  daysLeft: number;
  mode: string;
};

export default function JobRecommendations({ jobs }: { jobs: Job[] }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#7C8493]">Jobs recommendations</p>
          <p className="text-lg font-semibold text-[#25324B]">
            Recommendations (20)
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-[#25324B] shadow-sm hover:bg-gray-50">
          Filter
          <Filter className="h-4 w-4 text-[#7C8493]" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={`${job.title}-${job.daysLeft}`}
            className="rounded-2xl border border-gray-100 bg-[#FBFBFF] p-5 hover:border-[#286ef0]/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full relative">
                  <Image
                    src="/images/companies/umurava.png"
                    alt=""
                    width={50}
                    height={50}
                    className="object-cover w-full h-full rounded-full"
                    // sizes="20px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#25324B]">
                    {job.title}
                  </p>
                  <p className="text-xs text-[#7C8493]">{job.company}</p>
                </div>
              </div>
              <Button
                size="xs"
                className="bg-[#286ef0] hover:bg-[#2566de] rounded-xl cursor-pointer"
              >
                More Details
              </Button>
            </div>

            <p className="mt-4 text-sm text-[#4B5563] leading-relaxed line-clamp-3">
              {job.description}
            </p>

            <div className="mt-5 flex items-center gap-6 text-xs text-[#7C8493]">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {job.type}
              </span>
              <span className="inline-flex items-center gap-2">
                <Timer className="h-4 w-4" />
                {job.daysLeft} days left
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {job.mode}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
        <p className="text-xs text-[#7C8493]">Showing 4 of 20 jobs</p>
        <div className="flex items-center gap-2 text-xs">
          <button className="rounded-lg border border-gray-100 px-3 py-2 text-[#25324B] hover:bg-gray-50">
            Previous
          </button>
          <button className="rounded-lg border border-gray-100 px-3 py-2 text-[#25324B] hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
