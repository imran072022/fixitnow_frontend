export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-red-50">{children}</div>
  );
}
