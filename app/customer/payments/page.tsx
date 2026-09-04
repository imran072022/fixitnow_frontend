import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getPaymentsServer } from "./_data/payments.server";
import type { Payment } from "./_types/payments";

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not paid";

const formatAmount = (amount: number) => `$${(amount / 100).toFixed(2)}`;

const statusClasses: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
  PENDING: "bg-amber-100 text-amber-800",
  CANCELLED: "bg-slate-100 text-slate-700",
};

function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <div className="grid gap-3 border-b border-border/60 px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-6">
      <div className="min-w-0">
        <p className="font-medium">Booking {payment.bookingId}</p>
        <p className="truncate text-sm text-muted-foreground">
          Transaction: {payment.transactionId}
        </p>
      </div>
      <div className="text-sm text-muted-foreground sm:text-right">
        <p>{payment.provider}</p>
        <p>{formatDate(payment.paidAt ?? payment.createdAt)}</p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
        <p className="font-semibold">{formatAmount(payment.amount)}</p>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[payment.status] ?? "bg-slate-100 text-slate-700"}`}
        >
          {payment.status}
        </span>
      </div>
    </div>
  );
}

const PaymentHistory = async () => {
  const { data: payments } = await getPaymentsServer();

  return (
    <div className="space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment history</h1>
        <p className="mt-2 text-muted-foreground">
          Review all payments made for your bookings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))
          ) : (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No payment transactions yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
