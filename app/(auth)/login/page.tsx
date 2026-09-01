"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TLoginFormData } from "../_types/auth.type";
import { loginSchema } from "../_validation/zodSchema";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const sessionExpired = searchParams.get("session");
  useEffect(() => {
    if (sessionExpired === "expired") {
      router.refresh();
    }
  }, [sessionExpired, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "Login failed. Please try again.");
        return;
      }

      if (result.success) {
        router.replace("/");
        router.refresh();

        return;
      }
    } catch {
      setServerError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 flex-col">
      {registered === "true" && (
        <p className="mb-4 text-sm text-green-600 bg-green-50 px-8 py-3 mx-w-md">
          Account created successfully. Please log in to continue.
        </p>
      )}
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Login</h1>
        {serverError && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
