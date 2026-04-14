"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";

export type AdminJobRow = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  status: "Open" | "Closed" | "Draft";
  postedAt: string;
  deadline: string;
  applicants: number;
  views: number;
};

export type SortKey = keyof Pick<
  AdminJobRow,
  | "title"
  | "company"
  | "status"
  | "postedAt"
  | "deadline"
  | "applicants"
  | "views"
>;

export default function AdminJobsTable({
  rows,
  sort,
  onSort,
  page,
  pageSize,
  total,
  onPrev,
  onNext,
  onRowAction,
}: {
  rows: AdminJobRow[];
  sort: { key: SortKey; direction: "asc" | "desc" };
  onSort: (key: SortKey) => void;
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onRowAction: (
    action: "edit" | "close" | "open" | "delete",
    row: AdminJobRow,
  ) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const columns = ((): ColumnDef<AdminJobRow, unknown>[] => {
    const base: ColumnDef<AdminJobRow, unknown>[] = [
      {
        header: "Job",
        accessorKey: "title",
        meta: { sortKey: "title" satisfies SortKey },
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#25324B]">
              {row.original.title}
            </p>
            <p className="truncate text-xs text-[#7C8493]">
              {row.original.location} • {row.original.type}
            </p>
          </div>
        ),
      },
      {
        header: "Company",
        accessorKey: "company",
        meta: { sortKey: "company" satisfies SortKey },
        cell: ({ row }) => (
          <p className="text-sm font-medium text-[#25324B]">
            {row.original.company}
          </p>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        meta: { sortKey: "status" satisfies SortKey },
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
              row.original.status === "Open"
                ? "border-green-200 bg-green-100 text-green-700"
                : row.original.status === "Closed"
                  ? "border-gray-200 bg-gray-100 text-gray-700"
                  : "border-amber-200 bg-amber-100 text-amber-700"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        header: "Posted",
        accessorKey: "postedAt",
        meta: { sortKey: "postedAt" satisfies SortKey },
        cell: ({ row }) => (
          <p className="text-sm text-[#25324B]">{row.original.postedAt}</p>
        ),
      },
      {
        header: "Deadline",
        accessorKey: "deadline",
        meta: { sortKey: "deadline" satisfies SortKey },
        cell: ({ row }) => (
          <p className="text-sm text-[#25324B]">{row.original.deadline}</p>
        ),
      },
      {
        header: () => <div className="text-right">Applicants</div>,
        accessorKey: "applicants",
        meta: { sortKey: "applicants" satisfies SortKey },
        cell: ({ row }) => (
          <p className="text-right text-sm font-semibold text-[#25324B]">
            {row.original.applicants}
          </p>
        ),
      },
      {
        header: () => <div className="text-right">Views</div>,
        accessorKey: "views",
        meta: { sortKey: "views" satisfies SortKey },
        cell: ({ row }) => (
          <p className="text-right text-sm font-semibold text-[#25324B]">
            {row.original.views}
          </p>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onRowAction("edit", row.original)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#25324B] hover:bg-gray-50"
            >
              Edit
            </button>
            {row.original.status !== "Closed" ? (
              <button
                type="button"
                onClick={() => onRowAction("close", row.original)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#25324B] hover:bg-gray-50"
              >
                Close
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRowAction("open", row.original)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#25324B] hover:bg-gray-50"
              >
                Reopen
              </button>
            )}
            <button
              type="button"
              onClick={() => onRowAction("delete", row.original)}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        ),
      },
    ];

    return base;
  })();

  const sorting: SortingState = [
    { id: sort.key, desc: sort.direction === "desc" },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      pagination: { pageIndex: page, pageSize },
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-gray-100">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const meta = header.column.columnDef.meta as
                    | { sortKey?: SortKey }
                    | undefined;
                  const sortKey = meta?.sortKey;

                  const sorted =
                    sortKey && sort.key === sortKey ? sort.direction : false;

                  return (
                    <th key={header.id} className="px-6 py-4">
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 text-xs font-semibold ${
                            canSort
                              ? "cursor-pointer select-none text-[#7C8493] hover:text-[#25324B]"
                              : "text-[#7C8493]"
                          } ${
                            header.column.id === "applicants" ||
                            header.column.id === "views" ||
                            header.column.id === "actions"
                              ? "justify-end"
                              : ""
                          }`}
                          onClick={
                            canSort && sortKey
                              ? () => onSort(sortKey)
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === "asc" && (
                            <ArrowUp className="h-3.5 w-3.5" />
                          )}
                          {sorted === "desc" && (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 hover:bg-[#F8F8FD]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <p className="text-sm font-semibold text-[#25324B]">
                    No jobs found
                  </p>
                  <p className="mt-1 text-sm text-[#7C8493]">
                    Try adjusting your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#7C8493]">
          Page <span className="font-semibold text-[#25324B]">{page + 1}</span>{" "}
          of <span className="font-semibold text-[#25324B]">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={page === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#25324B] disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={page + 1 >= totalPages}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#25324B] disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
