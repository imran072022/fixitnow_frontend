import { Calendar, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Review, TechnicianProfile } from "../../_types/technicians";

type TechnicianReviewsProps = {
  bookings: TechnicianProfile["bookings"];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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
            "size-3.5",
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

const extractReviews = (bookings: TechnicianProfile["bookings"]): Review[] =>
  bookings
    .flatMap((booking) => (booking.review ? [booking.review] : []))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

export function TechnicianReviews({ bookings }: TechnicianReviewsProps) {
  const reviews = extractReviews(bookings);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Star className="size-5 text-primary" aria-hidden="true" />
          </div>

          <CardTitle className="text-lg font-semibold">Reviews</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {reviews.length > 0 ? (
          <div className="flex flex-col divide-y divide-border/60">
            {reviews.map((review) => {
              const reviewerInitials = getInitials(review.reviewer.name);

              return (
                <div
                  key={review.id}
                  className="flex gap-4 py-5 first:pt-2 last:pb-2"
                >
                  <Avatar className="size-10 shrink-0 ring-2 ring-background">
                    <AvatarImage
                      src={review.reviewer.photoUrl ?? undefined}
                      alt={`${review.reviewer.name} avatar`}
                    />

                    <AvatarFallback className="bg-secondary text-sm font-semibold text-secondary-foreground">
                      {reviewerInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold">
                        {review.reviewer.name}
                      </span>

                      <div className="flex items-center gap-3">
                        {renderStars(review.rating)}

                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" aria-hidden="true" />
                          {formatReviewDate(review.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                      {review.review}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted/60">
              <Star
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm font-medium text-foreground">
              No reviews yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Be the first to leave a review after booking this technician.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
