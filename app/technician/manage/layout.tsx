import ManagementLayout, {
  NavLink,
} from "@/components/shared/ManagementLayout";

const technicianNavigation: NavLink[] = [
  {
    label: "Overview",
    href: "/technician/manage",
    icon: "tableOfContents",
  },
  {
    label: "Services",
    href: "/technician/manage/services",
    icon: "wrench",
  },
  {
    label: "Availability",
    href: "/technician/manage/availability",
    icon: "calendar",
  },
  {
    label: "Bookings",
    href: "/technician/manage/bookings",
    icon: "notepadText",
  },
];

export default function TechnicianManagementLayout({
  children,
}: LayoutProps<"/technician/manage">) {
  return (
    <div className="min-h-full bg-gradient-to-r from-blue-50 to-red-50">
      <ManagementLayout navigation={technicianNavigation}>
        {children}
      </ManagementLayout>
    </div>
  );
}
