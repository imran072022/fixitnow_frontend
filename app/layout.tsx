import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="flex min-h-screen flex-col  text-foreground">
        <Navbar user={user} />

        <main className="flex-1 bg-gradient-to-r from-blue-50">{children}</main>

        <Footer />

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
