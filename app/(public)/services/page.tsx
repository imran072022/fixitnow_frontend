import { getServices } from "../_data/services";
import { getCategories } from "../_data/categories";
import { ServiceCard } from "../_components/ServiceCard";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ServicesFiltersWrapper } from "../_components/ServicesFiltersWrapper";

interface ServicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Services = async ({ searchParams }: ServicesPageProps) => {
  const params = await searchParams;

  // Parse query parameters
  const search = typeof params.search === "string" ? params.search : "";
  const category =
    typeof params.category === "string" ? params.category : "all";
  const minPrice = typeof params.minPrice === "string" ? params.minPrice : "";
  const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : "";
  const sort = typeof params.sort === "string" ? params.sort : "createdAt-desc";
  const page = parseInt(
    typeof params.page === "string" ? params.page : "1",
    10,
  );

  // Map filter values to API query parameters
  const minPriceNum = minPrice ? parseInt(minPrice, 10) * 100 : undefined;
  const maxPriceNum = maxPrice ? parseInt(maxPrice, 10) * 100 : undefined;
  const [sortBy, sortOrder] = sort.split("-");

  // Fetch data
  let services: Awaited<ReturnType<typeof getServices>>["data"]["services"] =
    [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 0 };
  let categoryList: string[] = [];

  try {
    const [servResponse, catResponse] = await Promise.all([
      getServices({
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        minPrice: minPriceNum,
        maxPrice: maxPriceNum,
        sortBy: sortBy as "price" | "createdAt" | undefined,
        sortOrder: sortOrder as "asc" | "desc" | undefined,
        page,
        limit: 10,
      }),
      getCategories(),
    ]);

    services = servResponse.data.services;
    meta = servResponse.data.meta;
    categoryList = catResponse.data.map((cat) => cat.name);
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }

  return (
    <main className=" px-4 py-24">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Browse All Services
      </h2>

      <div className="mx-auto max-w-7xl">
        <ServicesFiltersWrapper
          categories={categoryList}
          currentSearch={search}
          currentCategory={category}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentSort={sort}
        />

        <div className="mt-12">
          {services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={createPaginationLink(params, page - 1)}
                          />
                        </PaginationItem>
                      )}

                      {/* Page numbers */}
                      {Array.from({ length: meta.totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const isCurrentPage = pageNum === page;
                        const isVisible =
                          pageNum === 1 ||
                          pageNum === meta.totalPages ||
                          Math.abs(pageNum - page) <= 1;

                        if (!isVisible && pageNum === 2) {
                          return (
                            <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        if (!isVisible && pageNum === meta.totalPages - 1) {
                          return (
                            <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        if (!isVisible) return null;

                        return (
                          <PaginationItem key={pageNum}>
                            {isCurrentPage ? (
                              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
                                {pageNum}
                              </span>
                            ) : (
                              <PaginationLink
                                href={createPaginationLink(params, pageNum)}
                              >
                                {pageNum}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        );
                      })}

                      {page < meta.totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            href={createPaginationLink(params, page + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg text-muted-foreground">
                No services found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

function createPaginationLink(
  params: Record<string, string | string[] | undefined>,
  newPage: number,
): string {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", String(params.search));
  if (params.category && params.category !== "all")
    queryParams.append("category", String(params.category));
  if (params.minPrice) queryParams.append("minPrice", String(params.minPrice));
  if (params.maxPrice) queryParams.append("maxPrice", String(params.maxPrice));
  if (params.sort) queryParams.append("sort", String(params.sort));
  queryParams.append("page", String(newPage));

  return `/services?${queryParams.toString()}`;
}

export default Services;
