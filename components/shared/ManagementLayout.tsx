"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  NotepadText,
  TableOfContents,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const icons = {
  tableOfContents: TableOfContents,
  wrench: WrenchIcon,
  calendar: CalendarDaysIcon,
  folder: FolderIcon,
  users: UsersIcon,
  notepadText: NotepadText,
  calendarClock: CalendarDaysIcon,
};

export type NavLink = {
  label: string;
  href: string;
  icon: keyof typeof icons;
};

type ManagementLayoutProps = {
  navigation: NavLink[];
  children: React.ReactNode;
};

export default function ManagementLayout({
  navigation,
  children,
}: ManagementLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Mobile Management Navigation */}
      <div className="sticky top-16 z-30 border-b bg-background md:hidden">
        <div className="flex h-12 items-center gap-1 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navigation.map((item) => {
            const Icon = icons[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r bg-background transition-[width] duration-200 md:block",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
          {/* Sidebar Header */}
          <div
            className={cn(
              "flex h-16 items-center border-b",
              isCollapsed ? "justify-center px-2" : "justify-between px-4",
            )}
          >
            {!isCollapsed && (
              <span className="text-sm font-semibold tracking-tight">
                Management
              </span>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setIsCollapsed((collapsed) => !collapsed)}
              aria-label={
                isCollapsed
                  ? "Expand management sidebar"
                  : "Collapse management sidebar"
              }
            >
              {isCollapsed ? (
                <ChevronRightIcon className="size-4" />
              ) : (
                <ChevronLeftIcon className="size-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            {navigation.map((item) => {
              const Icon = icons[item.icon];
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-md py-2.5 text-sm font-medium transition-colors",
                    isCollapsed ? "justify-center px-2" : "gap-3 px-3",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />

                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t p-3">
            <Link
              href="/"
              title={isCollapsed ? "Back to Home" : undefined}
              className={cn(
                "flex items-center rounded-md py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                isCollapsed ? "justify-center px-2" : "gap-3 px-3",
              )}
            >
              <ChevronRightIcon className="size-4 shrink-0" />

              {!isCollapsed && <span>Back to Home</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
