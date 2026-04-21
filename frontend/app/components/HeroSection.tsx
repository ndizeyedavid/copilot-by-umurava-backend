import { Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  const popularTags = ["UI Designer", "UX Researcher", "Android", "Admin"];

  return (
    <section className="relative mt-[50px] bg-[#f8f8fd] overflow-hidden">
      <div className="relative mx-[122px] py-16 flex items-center justify-between">
        {/* Left content */}
        <div className="max-w-2xl w-full">
          <h1 className="text-[70px] font-bold text-[#25324B] leading-tight">
            AI-Powered
            <br />
            Talent
            <br />
            <span className="text-[#286ef0]">Acquisition</span>
          </h1>

          {/* Blue underline decoration */}
          <img
            src={"/images/illustrations/underline.svg"}
            alt="Underline"
            className=""
          />
          <p className="text-gray-500 text-base mb-8 leading-relaxed pt-5">
            Streamline your hiring process with AI-driven candidate screening,
            <br />
            automated workflows, and data-driven recruitment decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              className="bg-[#286ef0] hover:bg-[#2566de] text-white px-8 py-4 text-sm font-semibold"
            >
              Access Admin Dashboard
            </a>
            <a
              href="/admin/jobs"
              className="border border-gray-300 hover:border-[#286ef0] hover:text-[#286ef0] text-gray-700 px-8 py-4 text-sm font-semibold transition-all"
            >
              Manage Job Postings
            </a>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#286ef0]">500+</p>
              <p className="text-sm text-gray-500">Companies Hiring</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#286ef0]">10K+</p>
              <p className="text-sm text-gray-500">Talents Screened</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#286ef0]">85%</p>
              <p className="text-sm text-gray-500">Faster Hiring</p>
            </div>
          </div>
        </div>

        {/* Right - Hero image placeholder */}
        <div className="relative w-[500px] h-[450px] flex items-center justify-center">
          <Image
            src="/images/illustrations/pattern.svg"
            className="absolute top-0 right-[100px] scale-170 z-0"
            alt=""
            width={860}
            height={794}
          />

          <Image
            src="/images/illustrations/arrow.svg"
            className="absolute top-[-10px] left-[-200px] scale-170 z-0 -rotate-30"
            alt=""
            width={200}
            height={209}
          />

          <div className="w-[401px] h-[557px] relative z-10 overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/vDfTbBMQCcI"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="w-[283px] h-[731px] bg-[#f8f8fd] absolute p-4 bottom-[-460px] right-[-100px] z-20 rotate-50" />
        </div>
      </div>
    </section>
  );
}
