"use client";

import { useEffect, useMemo, useState } from "react";

import AdminJobsCards from "@/app/components/admin/jobs/AdminJobsCards";
import AdminJobsTable, {
  type AdminJobRow,
  type SortKey,
} from "@/app/components/admin/jobs/AdminJobsTable";
import AdminJobsToolbar from "@/app/components/admin/jobs/AdminJobsToolbar";

const mockJobs: AdminJobRow[] = [
  {
    id: "job_1",
    title: "Senior Frontend Engineer",
    company: "Umurava",
    location: "Kigali, Rwanda",
    type: "Full-time",
    status: "Open",
    postedAt: "2026-04-10",
    deadline: "2026-04-20",
    applicants: 48,
    views: 312,
  },
  {
    id: "job_2",
    title: "Backend Developer",
    company: "TechCorp Solutions",
    location: "Nairobi, Kenya",
    type: "Full-time",
    status: "Open",
    postedAt: "2026-04-11",
    deadline: "2026-04-22",
    applicants: 64,
    views: 401,
  },
  {
    id: "job_3",
    title: "Product Designer",
    company: "Copilot Team",
    location: "Remote",
    type: "Contract",
    status: "Open",
    postedAt: "2026-04-12",
    deadline: "2026-04-25",
    applicants: 31,
    views: 220,
  },
  {
    id: "job_4",
    title: "Data Analyst",
    company: "Digital Innovations",
    location: "Hybrid",
    type: "Part-time",
    status: "Closed",
    postedAt: "2026-03-28",
    deadline: "2026-04-08",
    applicants: 92,
    views: 520,
  },
  {
    id: "job_5",
    title: "UI/UX Designer (Intern)",
    company: "Creative Studios",
    location: "Kampala, Uganda",
    type: "Internship",
    status: "Draft",
    postedAt: "2026-04-13",
    deadline: "2026-04-30",
    applicants: 0,
    views: 0,
  },
  {
    id: "job_6",
    title: "DevOps Engineer",
    company: "CloudTech Inc",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    postedAt: "2026-04-14",
    deadline: "2026-04-28",
    applicants: 27,
    views: 198,
  },
  {
    id: "job_7",
    title: "Customer Success Specialist",
    company: "Enterprise Solutions",
    location: "Kigali, Rwanda",
    type: "Full-time",
    status: "Open",
    postedAt: "2026-04-06",
    deadline: "2026-04-24",
    applicants: 19,
    views: 140,
  },
  {
    id: "job_8",
    title: "QA Engineer",
    company: "StartupHub",
    location: "Nairobi, Kenya",
    type: "Contract",
    status: "Closed",
    postedAt: "2026-03-19",
    deadline: "2026-04-02",
    applicants: 53,
    views: 298,
  },
  {
    id: "job_9",
    title: "Mobile Developer (React Native)",
    company: "Digital Innovations",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    postedAt: "2026-04-09",
    deadline: "2026-04-27",
    applicants: 22,
    views: 174,
  },
  {
    id: "job_10",
    title: "HR Assistant",
    company: "Umurava",
    location: "Kigali, Rwanda",
    type: "Part-time",
    status: "Draft",
    postedAt: "2026-04-07",
    deadline: "2026-05-01",
    applicants: 0,
    views: 0,
  },
];

function compare(a: AdminJobRow, b: AdminJobRow, key: SortKey) {
  const va = a[key];
  const vb = b[key];

  if (typeof va === "number" && typeof vb === "number") return va - vb;
  return String(va).localeCompare(String(vb));
}

export default function AdminJobsPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>(
    { key: "postedAt", direction: "desc" },
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return mockJobs.filter((job) => {
      const matchesQuery =
        q.length === 0 ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q);

      const matchesStatus = status === "all" || job.status === status;
      const matchesType = type === "all" || job.type === type;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [query, status, type]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const diff = compare(a, b, sort.key);
      return sort.direction === "asc" ? diff : -diff;
    });
    return copy;
  }, [filtered, sort]);

  const paged = useMemo(() => {
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const total = sorted.length;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [page, safePage]);

  const handleSort = (key: SortKey) => {
    setPage(0);
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  };

  const onPrev = () => setPage((p) => Math.max(0, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const onRowAction = (
    action: "edit" | "close" | "open" | "delete",
    row: AdminJobRow,
  ) => {
    console.log("job action", action, row);
  };

  return (
    <div className="space-y-5">
      <AdminJobsToolbar
        query={query}
        onQuery={(v) => {
          setPage(0);
          setQuery(v);
        }}
        status={status}
        onStatus={(v) => {
          setPage(0);
          setStatus(v);
        }}
        type={type}
        onType={(v) => {
          setPage(0);
          setType(v);
        }}
        viewMode={viewMode}
        onViewMode={setViewMode}
        pageSize={pageSize}
        onPageSize={(n) => {
          setPage(0);
          setPageSize(n);
        }}
        totalLabel={`${total} jobs`}
      />

      {viewMode === "table" ? (
        <AdminJobsTable
          rows={paged}
          sort={sort}
          onSort={handleSort}
          page={safePage}
          pageSize={pageSize}
          total={total}
          onPrev={onPrev}
          onNext={onNext}
          onRowAction={onRowAction}
        />
      ) : (
        <AdminJobsCards rows={paged} onAction={onRowAction} />
      )}
    </div>
  );
}
