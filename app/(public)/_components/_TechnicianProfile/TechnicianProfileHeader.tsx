"use client";

import {
  AlertCircle,
  Briefcase,
  CalendarClock,
  MapPin,
  Plane,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { TechnicianProfile } from "../../_types/technicians";
import { CreateBookingModal } from "./CreateBookingModal";

type TechnicianProfileHeaderProps = {
  profile: TechnicianProfile;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const renderStars = (rating: number) => {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((number) => (
        <Star
          key={number}
          className={cn(
            "size-4",
            number <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export function TechnicianProfileHeader({
  profile,
}: TechnicianProfileHeaderProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const router = useRouter();
  const initials = getInitials(profile.user.name);

  async function handleBookingClick() {
    setCheckingAuth(true);

    try {
      const response = await fetch("/api/backend/auth/me");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.ok) {
        setBookingOpen(true);
      }
    } finally {
      setCheckingAuth(false);
    }
  }

  return (
    <Card className="mb-8 overflow-hidden border-border/70 shadow-sm">
      <div className="relative">
        {/* Decorative header background */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 sm:h-40" />

        {/* Desktop / mobile content */}
        <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
          {/* Avatar */}

          <Avatar className="relative -mt-14 size-16 ring-4 ring-background sm:-mt-16 lg:size-24">
            <AvatarImage
              src={profile.user.photoUrl ?? undefined}
              alt={`${profile.user.name} profile photo`}
              className="object-cover"
            />

            <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Main information */}
          <div className="mt-5 flex flex-col gap-6 sm:mt-4 sm:flex-row sm:items-end sm:gap-8">
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                  {profile.user.name}
                </h1>

                {profile.isOnVacation && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-500">
                    <Plane className="size-3" aria-hidden="true" />
                    On Vacation
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {profile.location}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-4" aria-hidden="true" />
                  {profile.experience} years experience
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                {renderStars(profile.ratingAverage)}

                <span className="text-sm font-semibold">
                  {profile.ratingAverage.toFixed(1)}
                </span>

                <span className="text-sm text-muted-foreground">
                  ({profile.reviewCount}{" "}
                  {profile.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            {/* Booking button */}
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              {profile.isBookable ? (
                <Button
                  size="lg"
                  className="w-full sm:w-48"
                  onClick={handleBookingClick}
                  disabled={checkingAuth}
                  aria-label={`Book ${profile.user.name}`}
                >
                  <CalendarClock className="size-4" aria-hidden="true" />
                  Book Technician
                </Button>
              ) : (
                <Button
                  disabled
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-48"
                  aria-label="Technician is not currently accepting bookings"
                >
                  {profile.isOnVacation ? (
                    <>
                      <Plane className="size-4" aria-hidden="true" />
                      Unavailable
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-4" aria-hidden="true" />
                      Not Accepting Bookings
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreateBookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        services={profile.services}
        availabilitySlots={profile.availabilitySlots}
      />
    </Card>
  );
}
