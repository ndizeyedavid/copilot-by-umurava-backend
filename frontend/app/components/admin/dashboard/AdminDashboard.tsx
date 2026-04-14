"use client";

import AdminKpiCards from "@/app/components/admin/dashboard/AdminKpiCards";
import AdminJobsPreview from "@/app/components/admin/dashboard/AdminJobsPreview";
import AdminRecentApplicationsTable from "@/app/components/admin/dashboard/AdminRecentApplicationsTable";
import AdminCandidateCompositionChart from "@/app/components/admin/charts/AdminCandidateCompositionChart";
import AdminJobStatisticsChart from "@/app/components/admin/charts/AdminJobStatisticsChart";

export default function AdminDashboard() {
  const kpis = {
    totalJobs: 54,
    openJobs: 32,
    closedJobs: 22,
  };

  const jobStats = [
    { label: "Jan", views: 52, applications: 28 },
    { label: "Feb", views: 62, applications: 34 },
    { label: "Mar", views: 76, applications: 43 },
    { label: "Apr", views: 58, applications: 31 },
    { label: "May", views: 44, applications: 22 },
    { label: "Jun", views: 57, applications: 30 },
    { label: "Jul", views: 64, applications: 36 },
    { label: "Aug", views: 82, applications: 49 },
    { label: "Sep", views: 70, applications: 41 },
    { label: "Oct", views: 60, applications: 33 },
    { label: "Nov", views: 50, applications: 27 },
    { label: "Dec", views: 74, applications: 45 },
  ];

  const composition = [
    { label: "Junior", value: 312, color: "#4F46E5", icon: "single" as const },
    {
      label: "Mid-level",
      value: 401,
      color: "#10B981",
      icon: "group" as const,
    },
    { label: "Senior", value: 143, color: "#F59E0B", icon: "single" as const },
  ];

  const applications = [
    {
      id: "1",
      applicantName: "Justin Lipshutz",
      jobTitle: "Product Designer",
      department: "Design",
      experience: "3 yrs",
      status: "Shortlisted" as const,
      avatar: "/images/companies/dummy.png",
    },
    {
      id: "2",
      applicantName: "Marcus Culhane",
      jobTitle: "Frontend Engineer",
      department: "Engineering",
      experience: "2 yrs",
      status: "Under Review" as const,
      avatar: "/images/companies/dummy.png",
    },
    {
      id: "3",
      applicantName: "Leo Stanton",
      jobTitle: "Data Analyst",
      department: "Data",
      experience: "4 yrs",
      status: "Rejected" as const,
      avatar: "/images/companies/dummy.png",
    },
  ];

  const jobsPreview = [
    {
      id: "j1",
      title: "Senior Frontend Engineer",
      company: "Umurava",
      location: "Kigali, Rwanda",
      type: "Full-time" as const,
      status: "Open" as const,
      postedAtLabel: "2d ago",
      applicants: 48,
    },
    {
      id: "j2",
      title: "Product Designer",
      company: "Copilot Team",
      location: "Remote",
      type: "Contract" as const,
      status: "Open" as const,
      postedAtLabel: "5d ago",
      applicants: 31,
    },
    {
      id: "j3",
      title: "Backend Developer",
      company: "TechCorp Solutions",
      location: "Nairobi, Kenya",
      type: "Full-time" as const,
      status: "Open" as const,
      postedAtLabel: "1w ago",
      applicants: 64,
    },
    {
      id: "j4",
      title: "Data Analyst",
      company: "Digital Innovations",
      location: "Hybrid",
      type: "Part-time" as const,
      status: "Closed" as const,
      postedAtLabel: "3w ago",
      applicants: 92,
    },
    {
      id: "j5",
      title: "DevOps Engineer",
      company: "CloudTech Inc",
      location: "Remote",
      type: "Full-time" as const,
      status: "Open" as const,
      postedAtLabel: "4d ago",
      applicants: 27,
    },
    {
      id: "j6",
      title: "UI/UX Designer (Intern)",
      company: "Creative Studios",
      location: "Kampala, Uganda",
      type: "Internship" as const,
      status: "Open" as const,
      postedAtLabel: "6d ago",
      applicants: 18,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminKpiCards
        totalJobs={kpis.totalJobs}
        openJobs={kpis.openJobs}
        closedJobs={kpis.closedJobs}
      />

      <AdminJobStatisticsChart data={jobStats} rangeLabel="This Month" />

      <AdminJobsPreview jobs={jobsPreview.slice(0, 6)} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminRecentApplicationsTable rows={applications} />
        </div>
        <div className="xl:col-span-1">
          <AdminCandidateCompositionChart
            data={composition}
            totalLabel="856 candidates total"
          />
        </div>
      </div>
    </div>
  );
}
