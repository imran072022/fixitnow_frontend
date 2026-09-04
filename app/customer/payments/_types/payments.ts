export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | string;

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  provider: string;
  transactionId: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentHistoryResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Payment[];
};
