"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

const user = {
  name: "Ava Mitchell",
  email: "ava@acme.com",
  avatar: "/avatars/ava.png",
};

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-mono text-xl font-semibold tracking-tight text-foreground"
          >
            Learn<span className="text-muted-foreground">/NextJS</span>
          </Link>
        </div>
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

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" className="h-10 gap-2 px-2" />}
          >
            <Avatar className="size-7">
              <AvatarImage src={user.avatar} alt="" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">
              {user.name}
            </span>
            <span className="sr-only">Open user menu</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <LogOutIcon className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
