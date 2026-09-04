import Link from "next/link";

const footerLinks = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
  { label: "Sign in", href: "/login" },
];

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-200">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold text-white">
            FixItNow
          </Link>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            A simple way to connect with trusted local service professionals.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
