"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth.client";

type NavbarUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type NavbarProps = {
  user: NavbarUser | null;
};

type NavLink = {
  label: string;
  href: string;
};

const publicNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

const customerNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
  { label: "Bookings", href: "/customer/bookings" },
  { label: "Payments", href: "/customer/payments" },
];
const technicianNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
  { label: "Manage", href: "/technician/manage" },
];
const adminNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
  { label: "Manage", href: "/admin/manage" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const currentUser = isAuthPage ? null : user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = !currentUser
    ? publicNavLinks
    : currentUser.role === "CUSTOMER"
      ? customerNavLinks
      : currentUser.role === "TECHNICIAN"
        ? technicianNavLinks
        : currentUser.role === "ADMIN"
          ? adminNavLinks
          : publicNavLinks;

  const profilePath = "/profile";

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const initials = currentUser?.name
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}

        <Link
          href={currentUser?.role === "CUSTOMER" ? "/services" : "/"}
          className="font-mono text-xl font-semibold tracking-tight text-foreground"
        >
          Learn<span className="text-muted-foreground">/NextJS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </Button>

          {/* Authentication */}
          {!currentUser && (
            <>
              {!isLoginPage && (
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                  Login
                </Link>
              )}

              {!isRegisterPage && (
                <Link
                  href="/register"
                  className="inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  Register
                </Link>
              )}
            </>
          )}

          {/* User Menu */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={"cursor-pointer"}
                render={<Button variant="ghost" className="h-10 gap-2 px-2" />}
              >
                <Avatar className="size-7">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <span className="hidden text-sm font-medium sm:inline">
                  {currentUser.name}
                </span>

                <span className="sr-only">Open user menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {currentUser.name}
                      </span>

                      <span className="text-xs font-normal text-muted-foreground">
                        {currentUser.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(profilePath)}
                  >
                    <UserIcon className="size-4 " />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className={"cursor-pointer"}
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background/95 md:hidden">
          <nav className="flex flex-col space-y-1 px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(link.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
