import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6 text-center">
        <CheckCircle2
          className="mx-auto size-16 text-emerald-600"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Payment successful
          </h1>
          <p className="text-muted-foreground">
            Your payment was received. Your booking is now ready for the
            technician.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button render={<Link href="/customer/bookings" />}>
            View my bookings
          </Button>
          <Button variant="outline" render={<Link href="/" />}>
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
