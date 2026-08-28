"use client";

import { MapPin, Phone, Star, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

export type Technician = {
  id: string;
  location: string;
  experience: number;
  ratingAverage: number;
  reviewCount: number;
  user: {
    name: string;
    phone: string | null;
    photoUrl: string | null;
  };
  services: {
    name: string;
    price: number;
  }[];
};

type TechnicianCardProps = {
  technician: Technician;
};

const formatPrice = (cents: number) =>
  `$${Math.round(cents / 100).toLocaleString()}`;

export function TechnicianCard({ technician }: TechnicianCardProps) {
  const visibleServices = technician.services.slice(0, 2);
  const remainingServices = Math.max(technician.services.length - 2, 0);
  const initials = technician.user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="size-16 shrink-0 ring-4 ring-muted">
          <AvatarImage
            src={technician.user.photoUrl ?? undefined}
            alt={`${technician.user.name} profile photo`}
          />
          <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold tracking-tight">
            {technician.user.name}
          </h2>
          <div className=" flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{technician.location}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {technician.experience} years experience
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 pt-2 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Star
              className="size-4 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            {technician.ratingAverage.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({technician.reviewCount} reviews)
          </span>
        </div>

        <div className="flex min-h-24 flex-col gap-2 border-t border-border/70 pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Wrench className="size-3.5" aria-hidden="true" />
            Services
          </div>
          <div className="flex flex-col gap-2">
            {visibleServices.map((service) => (
              <div
                className="flex min-w-0 items-center justify-between gap-3 text-sm"
                key={`${technician.id}-${service.name}`}
              >
                <span
                  className="min-w-0 truncate text-foreground"
                  title={service.name}
                >
                  {service.name}
                </span>
                <span className="shrink-0 font-medium text-primary">
                  {formatPrice(service.price)}
                </span>
              </div>
            ))}
            {remainingServices > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                +{remainingServices} more services
              </span>
            )}
            {technician.services.length === 0 && (
              <span className="text-sm text-muted-foreground">
                No services listed
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-3 border-t border-border/70 pt-4">
        <Link
          href={`/technicians/${technician.id}`}
          className={cn(buttonVariants(), "flex-1")}
        >
          View Profile
        </Link>
        {technician.user.phone && (
          <a
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            href={`tel:${technician.user.phone}`}
            aria-label={`Call ${technician.user.name}`}
          >
            <Phone className="size-4" aria-hidden="true" />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}

export { formatPrice };
