"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, RotateCcwIcon, SaveIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ProfileApiError, updateProfile } from "../_data/profile.client";
import {
  profileSchema,
  technicianProfileSchema,
  type Profile,
  type ProfileFormValues,
} from "../_types/profile";
import { useState } from "react";
import { toast } from "sonner";

type ProfileFormProps = {
  profile: Profile;
};

function toDateInputValue(value?: string) {
  return value ? value.slice(0, 10) : "";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getDefaultValues(profile: Profile): ProfileFormValues {
  return {
    name: profile.name,
    photoUrl: profile.photoUrl ?? "",
    phone: profile.phone ?? "",
    dob: toDateInputValue(profile.technicianProfile?.dob),
    location: profile.technicianProfile?.location ?? "",
    experience:
      profile.technicianProfile?.experience === undefined
        ? ""
        : String(profile.technicianProfile.experience),
  };
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [serverError, setServerError] = useState("");
  const isTechnician = profile.role === "TECHNICIAN";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(
      isTechnician ? technicianProfileSchema : profileSchema,
    ),
    defaultValues: getDefaultValues(profile),
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError("");

    try {
      const result = await updateProfile({
        name: values.name,
        photoUrl: values.photoUrl || null,
        phone: values.phone || null,

        ...(isTechnician
          ? {
              dob: values.dob
                ? new Date(`${values.dob}T00:00:00.000Z`).toISOString()
                : undefined,

              location: values.location || undefined,

              experience:
                values.experience === ""
                  ? undefined
                  : Number(values.experience),
            }
          : {}),
      });
      toast.success("Profile updated successfully.");

      reset(getDefaultValues(result.data));
    } catch (error) {
      if (error instanceof ProfileApiError) {
        let hasFieldError = false;

        if (Array.isArray(error.errors)) {
          error.errors.forEach((apiError) => {
            if (apiError.field) {
              setError(apiError.field as keyof ProfileFormValues, {
                type: "server",
                message: apiError.message,
              });

              hasFieldError = true;
            }
          });
        }
        toast.error(error.message || "Failed to update profile.");
        if (!hasFieldError) {
          setServerError(error.message);
        }
        return;
      }
      setServerError(
        error instanceof Error ? error.message : "Unable to update profile.",
      );
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="size-16 border border-border">
          <AvatarImage
            src={profile.photoUrl ?? undefined}
            alt={`${profile.name}'s profile`}
          />

          <AvatarFallback className="text-lg">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {profile.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, () => {
          setServerError("");
        })}
        className="space-y-6"
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600"
          >
            {serverError}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>

            <CardDescription>
              Your email and role are managed by your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Email" value={profile.email} />
            <ReadOnlyField label="Role" value={profile.role} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>

            <CardDescription>
              Keep the details people use to recognize and contact you current.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              name="name"
              label="Name"
              register={register}
              error={errors.name?.message}
            />

            {/* Phone */}
            <div className="grid gap-2 text-sm font-medium">
              <label htmlFor="phone">Phone</label>

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="phone"
                    international
                    defaultCountry="BD"
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? "")}
                    onBlur={field.onBlur}
                    className={`flex h-9 w-full items-center rounded-md border bg-background text-sm shadow-xs ${
                      errors.phone ? "border-destructive" : "border-input"
                    }`}
                    numberInputProps={{
                      className:
                        "h-full min-w-0 flex-1 bg-transparent px-3 outline-none",
                      autoComplete: "tel",
                    }}
                  />
                )}
              />

              {errors.phone && (
                <p className="text-xs font-normal text-destructive">
                  {String(errors.phone.message)}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <FormField
                name="photoUrl"
                label="Photo URL"
                register={register}
                error={errors.photoUrl?.message}
              />
            </div>
          </CardContent>
        </Card>

        {isTechnician && (
          <Card>
            <CardHeader>
              <CardTitle>Technician details</CardTitle>

              <CardDescription>
                These details help customers find the right technician.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField
                name="dob"
                label="Date of birth"
                type="date"
                register={register}
                error={errors.dob?.message}
              />

              <FormField
                name="experience"
                label="Experience (years)"
                type="number"
                register={register}
                error={errors.experience?.message}
              />

              <div className="sm:col-span-2">
                <FormField
                  name="location"
                  label="Location"
                  register={register}
                  error={errors.location?.message}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setServerError("");
              }}
              disabled={isSubmitting}
            >
              <RotateCcwIcon />
              Reset
            </Button>

            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <SaveIcon />
              )}
              Save changes
            </Button>
          </div>
        </div>

        {!isSubmitting && !serverError && (
          <div aria-live="polite" className="text-right text-sm">
            {/* Intentionally empty unless you want a success message here. */}
          </div>
        )}
      </form>
    </main>
  );
}

type FormFieldProps = {
  name: keyof ProfileFormValues;
  label: string;
  register: ReturnType<typeof useForm<ProfileFormValues>>["register"];
  error?: string;
  type?: string;
};

function FormField({
  name,
  label,
  register,
  error,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="grid gap-2 text-sm font-medium">
      <label htmlFor={name}>{label}</label>

      <Input
        id={name}
        type={type}
        aria-invalid={Boolean(error)}
        {...register(name)}
      />

      {error && (
        <p className="text-xs font-normal text-destructive">{String(error)}</p>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}

      <Input value={value} readOnly disabled className="bg-gray-100" />
    </label>
  );
}
