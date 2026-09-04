"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/app/(public)/_data/bookings.client";
import {
  reviewSchema,
  type ReviewFormValues,
} from "@/app/(public)/_validation/reviewSchema";

export function ReviewDialog({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      bookingId,
      rating: 5,
      review: "",
    },
  });

  async function onSubmit(values: ReviewFormValues) {
    setIsSubmitting(true);
    try {
      const response = await createReview({
        bookingId: values.bookingId,
        rating: values.rating,
        review: values.review.trim(),
      });
      toast.success(response.message);
      setOpen(false);
      form.reset({ bookingId, rating: 5, review: "" });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save your review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Star className="size-4" />
        Review
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review this service</DialogTitle>
            <DialogDescription>
              Share your experience with the technician.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <label className="grid gap-2 text-sm font-medium">
              Rating
              <Input
                type="number"
                min={1}
                max={5}
                step={1}
                {...form.register("rating", { valueAsNumber: true })}
                aria-invalid={Boolean(form.formState.errors.rating)}
              />
              {form.formState.errors.rating?.message && (
                <span className="text-sm font-normal text-destructive">
                  {form.formState.errors.rating.message}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Review
              <Textarea
                maxLength={100}
                placeholder="Tell us about the service"
                {...form.register("review")}
                aria-invalid={Boolean(form.formState.errors.review)}
              />
              {form.formState.errors.review?.message && (
                <span className="text-sm font-normal text-destructive">
                  {form.formState.errors.review.message}
                </span>
              )}
            </label>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
