import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ServiceCard } from "./_components/ServiceCard";
import { TechnicianCard } from "./_components/TechnicianCard";
import { getServices } from "./_data/services";
import { getTechnicians } from "./_data/technicians";

const PublicHomePage = async () => {
  const [servicesResult, techniciansResult] = await Promise.allSettled([
    getServices({ page: 1, limit: 4 }),
    getTechnicians({ page: 1, limit: 4 }),
  ]);

  const services =
    servicesResult.status === "fulfilled"
      ? servicesResult.value.data.services.slice(0, 4)
      : [];
  const technicians =
    techniciansResult.status === "fulfilled"
      ? techniciansResult.value.data.technicianProfiles.slice(0, 4)
      : [];

  return (
    <div>
      <section className="bg-slate-100 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            Local help, made simple
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Get the right person for the job.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Find dependable services and skilled technicians for the work that
            keeps your home and business moving.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Explore services
            </Link>
            <Link
              href="/technicians"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Meet technicians
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What you need"
            title="Browse popular services"
            action={{ label: "See all services", href: "/services" }}
          />
          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptySection label="Services will appear here soon." />
          )}
        </div>
      </section>

      <section className="bg-red-50 px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Who can help"
            title="Meet skilled technicians"
            action={{ label: "See all technicians", href: "/technicians" }}
          />
          {technicians.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {technicians.map((technician) => (
                <TechnicianCard key={technician.id} technician={technician} />
              ))}
            </div>
          ) : (
            <EmptySection label="Technicians will appear here soon." />
          )}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            About FixItNow
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Practical help for everyday work.
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            FixItNow brings customers and service professionals together in one
            straightforward place. This space can grow with the community and
            the services you offer.
          </p>
        </div>
      </section>
    </div>
  );
};

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <Link
        href={action.href}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        {action.label}
      </Link>
    </div>
  );
}

function EmptySection({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export default PublicHomePage;
