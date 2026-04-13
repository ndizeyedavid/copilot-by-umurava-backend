import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  type: string;
  logo: string;
  tags: { name: string; color: string }[];
}

const jobs: Job[] = [
  {
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    description: "Revolut is looking for Email Marketing to help team t ...",
    type: "Full Time",
    logo: "/images/companies/revolut.svg",
    tags: [
      { name: "Marketing", color: "bg-orange-100 text-orange-600" },
      { name: "Design", color: "bg-green-100 text-green-600" },
    ],
  },
  {
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, US",
    description: "Dropbox is looking for Brand Designer to help the team t ...",
    type: "Full Time",
    logo: "/images/companies/dropbox.svg",
    tags: [
      { name: "Design", color: "bg-green-100 text-green-600" },
      { name: "Business", color: "bg-purple-100 text-purple-600" },
    ],
  },
  {
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    description: "Pitch is looking for Customer Manager to join marketing t ...",
    type: "Full Time",
    logo: "/images/companies/pitch.svg",
    tags: [{ name: "Marketing", color: "bg-orange-100 text-orange-600" }],
  },
  {
    title: "Visual Designer",
    company: "Blinkist",
    location: "Granada, Spain",
    description: "Blinkist is looking for Visual Designer to help team desi ...",
    type: "Full Time",
    logo: "/images/companies/blinkist.svg",
    tags: [{ name: "Design", color: "bg-green-100 text-green-600" }],
  },
  {
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    description: "ClassPass is looking for Product Designer to help develop n ...",
    type: "Full Time",
    logo: "/images/companies/classpass.svg",
    tags: [
      { name: "Marketing", color: "bg-orange-100 text-orange-600" },
      { name: "Design", color: "bg-green-100 text-green-600" },
    ],
  },
  {
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    description: "Canva is looking for Lead Engineer to help develop n ...",
    type: "Full Time",
    logo: "/images/companies/canva.svg",
    tags: [
      { name: "Design", color: "bg-green-100 text-green-600" },
      { name: "Business", color: "bg-purple-100 text-purple-600" },
    ],
  },
  {
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    description: "GoDaddy is looking for Brand Strategist to join the team...",
    type: "Full Time",
    logo: "/images/companies/godaddy.svg",
    tags: [{ name: "Marketing", color: "bg-orange-100 text-orange-600" }],
  },
  {
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    description: "Twitter is looking for Data Analyst to help team desi ...",
    type: "Full Time",
    logo: "/images/companies/twitter.svg",
    tags: [{ name: "Technology", color: "bg-red-100 text-red-600" }],
  },
];

export default function FeaturedJobsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-[122px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-[#25324B]">
            Featured <span className="text-[#286ef0]">jobs</span>
          </h2>
          <a
            href=""
            className="flex items-center gap-2 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
          >
            Show all jobs
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div
              key={`${job.title}-${job.company}`}
              className="p-6 border border-gray-100 hover:border-[#286ef0] hover:shadow-md transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image
                    src={job.logo}
                    alt={job.company}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="px-3 py-1 text-xs font-medium text-[#4F46E5] border border-[#4F46E5] rounded">
                  {job.type}
                </span>
              </div>

              {/* Job Info */}
              <h3 className="text-lg font-semibold text-[#25324B] mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {job.company} · {job.location}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {job.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${tag.color}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
