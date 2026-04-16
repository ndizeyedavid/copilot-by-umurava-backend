"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/api/client";

type MeUser = {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  picture?: string;
  role?: "talent" | "admin";
};

export default function AdminProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data?.user as MeUser;
    },
    staleTime: 60_000,
  });

  const user = meQuery.data;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    picture: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: String(user.firstName ?? ""),
      lastName: String(user.lastName ?? ""),
      picture: String(user.picture ?? ""),
    });
  }, [user?._id]);

  const canSave = useMemo(() => {
    if (!user) return false;
    const first = String(form.firstName).trim();
    return first.length > 0;
  }, [form.firstName, user]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        firstName: String(form.firstName ?? "").trim(),
        lastName: String(form.lastName ?? "").trim(),
        picture: String(form.picture ?? "").trim() || undefined,
      };
      const res = await api.put("/auth/profile", payload);
      return res.data?.user as MeUser;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update profile");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C8493] hover:text-[#25324B]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your admin account information.
          </p>
        </div>

        {meQuery.isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#25324B]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading profile...
            </div>
          </div>
        ) : meQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Failed to load profile.
          </div>
        ) : !user ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-[#7C8493]">
            No user session.
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.picture || user.picture || "/images/companies/dummy.png"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border border-gray-200 bg-white text-gray-500">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#25324B]">
                    {String(user.firstName ?? "")} {String(user.lastName ?? "")}
                  </p>
                  <p className="text-xs font-semibold text-[#7C8493]">
                    Role: {user.role ?? "admin"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!canSave || updateProfileMutation.isPending}
                onClick={() => updateProfileMutation.mutate()}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                  canSave && !updateProfileMutation.isPending
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#25324B]">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, firstName: e.target.value }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#25324B]">
                  Last name
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#25324B]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={String(user.email ?? "")}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#25324B]">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={String(user.phone ?? "")}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-[#25324B]">
                  Profile picture URL
                </label>
                <input
                  value={form.picture}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, picture: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <p className="mt-2 text-xs text-[#7C8493]">
                  Password changes in Settings not supported by backend yet.
                  {" "}
                  <button
                    type="button"
                    onClick={() => router.push("/admin/settings")}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Go to Settings
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-[#25324B]">
                    Security
                  </p>
                  <p className="text-xs text-[#7C8493]">
                    Backend supports profile update (`PUT /auth/profile`) and
                    session info (`GET /auth/me`). Password change endpoint not
                    present.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
