import ManagementLayout, {
  NavLink,
} from "@/components/shared/ManagementLayout";

const adminNavigation: NavLink[] = [
  {
    label: "Overview",
    href: "/admin/manage",
    icon: "tableOfContents",
  },
  {
    label: "Users",
    href: "/admin/manage/users",
    icon: "users",
  },
  {
    label: "Categories",
    href: "/admin/manage/categories",
    icon: "folder",
  },
  {
    label: "Bookings",
    href: "/admin/manage/bookings",
    icon: "calendarClock",
  },
];

export default function AdminManagementLayout({
  children,
}: LayoutProps<"/admin/manage">) {
  return (
    <ManagementLayout navigation={adminNavigation}>{children}</ManagementLayout>
  );
}
