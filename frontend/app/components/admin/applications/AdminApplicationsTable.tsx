"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Mail,
  MoreHorizontal,
} from "lucide-react";

export type AdminApplicationRow = {
  id: string;
  talentName: string;
  talentAvatar?: string;
  talentHeadline: string;
  talentLocation: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  appliedDate: string;
  resumeUrl: string;
  coverLetter?: string;
};

export default function AdminApplicationsTable({
  rows,
  onViewDetails,
}: {
  rows: AdminApplicationRow[];
  onViewDetails: (row: AdminApplicationRow) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "appliedDate", desc: true },
  ]);

  const columns: ColumnDef<AdminApplicationRow>[] = [
    {
      header: "Candidate",
      accessorKey: "talentName",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase border border-indigo-100">
            {row.original.talentName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#25324B]">
              {row.original.talentName}
            </p>
            <p className="truncate text-xs text-[#7C8493]">
              {row.original.talentLocation}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Headline",
      accessorKey: "talentHeadline",
      cell: ({ row }) => (
        <p className="max-w-[200px] truncate text-sm text-[#7C8493]">
          {row.original.talentHeadline}
        </p>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const s = row.original.status;
        const color =
          s === "shortlisted"
            ? "border-green-200 bg-green-50 text-green-700"
            : s === "rejected"
              ? "border-red-200 bg-red-50 text-red-700"
              : s === "hired"
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : s === "reviewing"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-gray-50 text-gray-700";
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${color}`}
          >
            {s}
          </span>
        );
      },
    },
    {
      header: "Applied Date",
      accessorKey: "appliedDate",
      cell: ({ row }) => (
        <p className="text-sm text-[#25324B]">{row.original.appliedDate}</p>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onViewDetails(row.original)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#25324B] hover:bg-gray-50 transition-colors"
          >
            View Profile
          </button>
          <a
            href={row.original.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-[#7C8493] hover:text-[#286ef0] hover:border-[#286ef0] transition-colors"
          >
            <FileText className="h-4 w-4" />
          </a>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-[#F8F8FD] border-b border-gray-200">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <th key={header.id} className="px-6 py-4 text-left">
                      <div
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C8493] ${
                          header.column.getCanSort() ? "cursor-pointer select-none" : ""
                        } ${header.id === "actions" ? "justify-end" : ""}`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === "asc" && <ArrowUp className="h-3 w-3" />}
                        {sorted === "desc" && <ArrowDown className="h-3 w-3" />}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#F8F8FD]/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <Users className="h-10 w-10 text-gray-200 mb-2" />
                    <p className="text-sm font-semibold text-[#25324B]">No applications yet</p>
                    <p className="text-xs text-[#7C8493] mt-1">When candidates apply, they will appear here.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
        <p className="text-sm text-[#7C8493]">
          Showing <span className="font-semibold text-[#25324B]">{table.getRowModel().rows.length}</span> of <span className="font-semibold text-[#25324B]">{rows.length}</span> candidates
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
