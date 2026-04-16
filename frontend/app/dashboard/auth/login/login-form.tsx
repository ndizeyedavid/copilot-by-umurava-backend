"use client";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api/client";
import { useDispatch } from "react-redux";
import { setAuth } from "@/lib/store/authSlice";
import { useRouter } from "next/navigation";

type LoginValues = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: any;
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
};

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const loginMutation = useMutation<AuthResponse, any, LoginValues>({
    mutationFn: async (values) => {
      const res = await api.post("/auth/login/local", values);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, tokens: data.tokens }));
      toast.success("Login successful");
      // console.log(data.user.role);
      if (data.user.role === "admin") return router.push("/admin");
      router.push("/dashboard");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });

  const googleMutation = useMutation<AuthResponse, any, string>({
    mutationFn: async (credential) => {
      const res = await api.post("/auth/google/one-tap", { credential });
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, tokens: data.tokens }));
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });

  return (
    <form
      className="space-y-5 py-2"
      onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
    >
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          {...register("email", { required: "Email is required" })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: "Password is required" })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#286ef0] transition-colors"
        />
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password */}
      <div className="text-right -mt-2">
        <Link href="" className="text-sm text-[#286ef0] hover:text-[#2566de]">
          Forgot Your Password?
        </Link>
      </div>

      {/* Login button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-3 bg-[#286ef0] text-white font-medium rounded-lg hover:bg-[#2566de] transition-colors"
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>

      <div className="flex items-center gap-4  mb-5 text-black/50">
        <div className="w-full h-px bg-black/50" />
        <span>Or</span>
        <div className="w-full h-px bg-black/50" />
      </div>

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) {
            toast.error("Missing Google credential");
            return;
          }

          googleMutation.mutate(credentialResponse.credential);
        }}
        onError={() => {
          toast.error("Login Failed");
        }}
      />

      <div className="text-center mt-2">
        <span className="text-sm w-full">
          Don't have an account?{" "}
          <Link
            href="/dashboard/auth/register"
            className="text-[#286ef0] font-semibold hover:text-[#286ef0]/80"
          >
            Signup Now
          </Link>
        </span>
      </div>
    </form>
  );
}
