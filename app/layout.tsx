import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-background text-foreground">
        <Navbar user={user}></Navbar>
        {children}
      </body>
    </html>
  );
}
