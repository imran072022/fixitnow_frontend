"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRegisterFormData } from "../_types/auth.type";
import { registerSchema } from "../_validation/zodSchema";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TRegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  // Need to split - 1
  const password = watch("password") || "";
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;'']/.test(
    password,
  );
  const hasMinLength = password.length >= 8;
  const passwordIsValid =
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;

  const onSubmit = async (data: TRegisterFormData) => {
    setServerError("");

    try {
      const response = await fetch(`${process.env.API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        router.replace("/login?registered=true");
        return;
      }

      if (!response.ok) {
        if (Array.isArray(result.errors)) {
          let hasFieldError = false;

          result.errors.forEach(
            (error: { field?: string; message: string }) => {
              if (error.field) {
                setError(error.field as keyof TRegisterFormData, {
                  type: "server",
                  message: error.message,
                });

                hasFieldError = true;
              }
            },
          );

          if (result.message && !hasFieldError) {
            setServerError(result.message);
          }
        } else if (result.message) {
          setServerError(result.message);
        } else {
          setServerError("Registration failed. Please try again.");
        }

        return;
      }

      console.log("Registration successful:", result);

      // Redirect/login logic can be added here.
    } catch (error) {
      console.error("Registration failed:", error);
      setServerError(
        "Unable to connect to the server. Please try again later.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Register</h1>

        <p className="mb-6 text-sm text-gray-500">
          Create your account to get started.
        </p>

        {serverError && (
          <div
            role="alert"
            className="mb-5 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Name"
              {...register("name")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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

            {/* Only show the Zod error when password is empty */}
            {errors.password && password.length === 0 && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}

            {/* Password requirements */}
            {password.length > 0 && !passwordIsValid && (
              <div className="mt-1 space-y-0.5 text-xs">
                <p
                  className={hasUpperCase ? "text-green-500" : "text-gray-500"}
                >
                  • Include at least 1 uppercase letter
                </p>

                <p
                  className={hasLowerCase ? "text-green-500" : "text-gray-500"}
                >
                  • Include at least 1 lowercase letter
                </p>

                <p className={hasNumber ? "text-green-500" : "text-gray-500"}>
                  • Include at least 1 number
                </p>

                <p
                  className={
                    hasSpecialChar ? "text-green-500" : "text-gray-500"
                  }
                >
                  • Include at least 1 special character
                </p>

                <p
                  className={hasMinLength ? "text-green-500" : "text-gray-500"}
                >
                  • At least 8 characters
                </p>
              </div>
            )}

            {/* All requirements satisfied */}
            {password.length > 0 && passwordIsValid && (
              <p className="mt-1 text-xs text-green-500">
                • Password meets all requirements
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <span className="mb-2 block text-sm font-medium text-gray-700">
              Role
            </span>

            <div className="grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="CUSTOMER"
                  {...register("role")}
                  className="peer sr-only"
                />

                <span className="block rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-gray-900">
                  Customer
                </span>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="TECHNICIAN"
                  {...register("role")}
                  className="peer sr-only"
                />

                <span className="block rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white hover:bg-gray-50 peer-checked:hover:bg-gray-900">
                  Technician
                </span>
              </label>
            </div>

            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-md border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-gray-900 underline-offset-4 hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
