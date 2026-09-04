import Link from "next/link";
import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <CircleAlert
          className="mx-auto size-16 text-amber-600"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Payment cancelled
          </h1>
          <p className="text-muted-foreground">
            Your payment was not completed. Your booking remains available to
            pay from your bookings page.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button render={<Link href="/customer/bookings" />}>
            Back to bookings
          </Button>
          <Button variant="outline" render={<Link href="/" />}>
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
}
