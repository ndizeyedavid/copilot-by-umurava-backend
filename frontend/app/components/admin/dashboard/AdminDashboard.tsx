"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminKpiCards from "@/app/components/admin/dashboard/AdminKpiCards";
import AdminJobsPreview from "@/app/components/admin/dashboard/AdminJobsPreview";
import AdminRecentApplicationsTable from "@/app/components/admin/dashboard/AdminRecentApplicationsTable";
import AdminCandidateCompositionChart from "@/app/components/admin/charts/AdminCandidateCompositionChart";
import AdminJobStatisticsChart from "@/app/components/admin/charts/AdminJobStatisticsChart";
import { api } from "@/lib/api/client";

export default function AdminDashboard() {
  const jobsQuery = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: async () => {
      const res = await api.get("/jobs");
      return (res.data?.jobs ?? []) as any[];
    },
    staleTime: 60_000,
  });

  const talentsQuery = useQuery({
    queryKey: ["admin", "talents"],
    queryFn: async () => {
      const res = await api.get("/talents");
      return (res.data?.talents ?? []) as any[];
    },
    staleTime: 60_000,
  });

  const applicationsQuery = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const res = await api.get("/applications");
      return (res.data?.applications ?? []) as any[];
    },
    staleTime: 30_000,
  });

  const jobs = jobsQuery.data ?? [];
  const talents = talentsQuery.data ?? [];
  const applications = applicationsQuery.data ?? [];

  const now = Date.now();

  const kpis = useMemo(() => {
    const totalJobs = jobs.length;
    const openJobs = jobs.filter(
      (j) => new Date(j.deadline).getTime() > now,
    ).length;
    const closedJobs = Math.max(0, totalJobs - openJobs);
    const candidates = talents.length;
    return { totalJobs, openJobs, closedJobs, candidates };
  }, [jobs, talents, now]);

  const jobsPreview = useMemo(() => {
    const counts = new Map<string, number>();
    for (const app of applications) {
      const key = String(app.jobId);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    return jobs
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 6)
      .map((j) => {
        const deadlineTs = new Date(j.deadline).getTime();
        const status =
          deadlineTs > now ? ("Open" as const) : ("Closed" as const);
        return {
          id: String(j._id),
          title: String(j.title ?? ""),
          company: "—",
          location: String(j.locationType ?? ""),
          type: String(j.jobType ?? "") as any,
          status,
          postedAtLabel: "",
          applicants: counts.get(String(j._id)) || 0,
        };
      });
  }, [applications, jobs, now]);

  const recentApplicationsRows = useMemo(() => {
    const jobsById = new Map<string, any>(jobs.map((j) => [String(j._id), j]));
    const talentsById = new Map<string, any>(
      talents.map((t) => [String(t._id), t]),
    );

    return applications
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 5)
      .map((app) => {
        const talent = talentsById.get(String(app.talentId));
        const user = talent?.userId;
        const job = jobsById.get(String(app.jobId));

        const name =
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
          "Unknown";
        const jobTitle = job?.title || "Unknown";
        const statusMap: Record<string, any> = {
          shortlisted: "Shortlisted",
          reviewing: "Under Review",
          rejected: "Rejected",
          pending: "Under Review",
          hired: "Shortlisted",
        };

        return {
          id: String(app._id),
          applicantName: name,
          jobTitle,
          department: "—",
          experience: "—",
          status: statusMap[String(app.status)] || "Under Review",
          avatar: user?.picture || "/images/companies/dummy.png",
        };
      });
  }, [applications, jobs, talents]);

  const jobStats = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const app of applications) {
      const d = new Date(app.createdAt || app.createdAt || Date.now());
      const label = d.toLocaleString("en-US", { month: "short" });
      buckets.set(label, (buckets.get(label) || 0) + 1);
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((m) => ({
      label: m,
      views: 0,
      applications: buckets.get(m) || 0,
    }));
  }, [applications]);

  const composition = useMemo(() => {
    const yearsForTalent = (t: any) => {
      const ex = Array.isArray(t.experience) ? t.experience : [];
      let totalMonths = 0;
      for (const e of ex) {
        const start = e?.startDate ? new Date(e.startDate).getTime() : 0;
        const end = e?.endDate ? new Date(e.endDate).getTime() : Date.now();
        if (!start) continue;
        totalMonths += Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 30));
      }
      return totalMonths / 12;
    };

    let junior = 0;
    let mid = 0;
    let senior = 0;

    for (const t of talents) {
      const years = yearsForTalent(t);
      if (years < 2) junior++;
      else if (years < 5) mid++;
      else senior++;
    }

    return [
      {
        label: "Junior",
        value: junior,
        color: "#4F46E5",
        icon: "single" as const,
      },
      {
        label: "Mid-level",
        value: mid,
        color: "#10B981",
        icon: "group" as const,
      },
      {
        label: "Senior",
        value: senior,
        color: "#F59E0B",
        icon: "single" as const,
      },
    ];
  }, [talents]);

  return (
    <div className="space-y-6">
      <AdminKpiCards
        totalJobs={kpis.totalJobs}
        openJobs={kpis.openJobs}
        closedJobs={kpis.closedJobs}
        candidates={kpis.candidates}
      />

      <AdminJobStatisticsChart data={jobStats} rangeLabel="This Month" />

      <AdminJobsPreview jobs={jobsPreview.slice(0, 6)} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminRecentApplicationsTable rows={recentApplicationsRows} />
        </div>
        <div className="xl:col-span-1">
          <AdminCandidateCompositionChart
            data={composition}
            totalLabel={`${kpis.candidates} candidates total`}
          />
        </div>
      </div>
    </div>
  );
}
