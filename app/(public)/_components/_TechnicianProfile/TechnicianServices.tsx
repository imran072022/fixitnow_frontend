import { BadgeDollarSign, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TechnicianService } from "../../_types/technicians";

type TechnicianServicesProps = {
  services: TechnicianService[];
};

export function TechnicianServices({ services }: TechnicianServicesProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="size-5 text-primary" aria-hidden="true" />
          </div>

          <CardTitle className="text-lg font-semibold">Services</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background ring-1 ring-border/60">
                      <Wrench
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="font-semibold">{service.name}</h3>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <BadgeDollarSign className="size-3.5" aria-hidden="true" />$
                    {(service.price / 100).toFixed(2)}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No services listed yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
