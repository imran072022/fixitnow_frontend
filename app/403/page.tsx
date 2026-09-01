import { ShieldQuestionMark } from "lucide-react";
import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldQuestionMark className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-red-600 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Access Forbidden
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, you don&apos;t have the required permissions to view this page.
          Please contact your administrator if you believe this is an error.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
