"use client";

import { MapPin, Badge, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Service } from "../_types/services";

type ServiceCardProps = {
  service: Service;
};

const formatPrice = (cents: number) =>
  `$${Math.round(cents / 100).toLocaleString()}`;

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight">
              {service.name}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              <Badge className="size-3" aria-hidden="true" />
              {service.category.name}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(service.price)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="flex flex-col gap-2 border-t border-border/70 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Service Provider
          </p>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">
              {service.technicianProfile.user.name}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {service.technicianProfile.location}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/70 pt-4">
        <Link
          href={`/technicians/${service.technicianProfile.id}`}
          className={cn(buttonVariants({ variant: "default" }), "flex-1 gap-2")}
        >
          View Provider
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export { formatPrice };
