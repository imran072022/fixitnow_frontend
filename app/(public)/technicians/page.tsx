import { getTechnicians } from "../_data/technicians";
import { getCategories } from "../_data/categories";
import { TechnicianCard } from "../_components/TechnicianCard";
import { TechniciansFiltersWrapper } from "./_components/TechniciansFiltersWrapper";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TechniciansPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Technicians = async ({ searchParams }: TechniciansPageProps) => {
  const params = await searchParams;

  // Parse query parameters
  const search = typeof params.search === "string" ? params.search : "";
  const category =
    typeof params.category === "string" ? params.category : "all";
  const experience =
    typeof params.experience === "string" ? params.experience : "any";
  const rating = typeof params.rating === "string" ? params.rating : "any";
  const sort = typeof params.sort === "string" ? params.sort : "rating-desc";
  const page = parseInt(
    typeof params.page === "string" ? params.page : "1",
    10,
  );

  // Map filter values to API query parameters
  const minExperience =
    experience !== "any" ? parseInt(experience, 10) : undefined;
  const minRating = rating !== "any" ? parseFloat(rating) : undefined;
  const [sortBy, sortOrder] = sort.split("-");

  // Fetch data
  let technicians: Awaited<
    ReturnType<typeof getTechnicians>
  >["data"]["technicianProfiles"] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 0 };
  let categoryList: string[] = [];

  try {
    const [techResponse, catResponse] = await Promise.all([
      getTechnicians({
        search: search || undefined,
        category: category !== "all" ? category : undefined,
        minExperience,
        minRating,
        sortBy: sortBy as "experience" | "rating" | undefined,
        sortOrder: sortOrder as "asc" | "desc" | undefined,
        page,
        limit: 10,
      }),
      getCategories(),
    ]);

    technicians = techResponse.data.technicianProfiles;
    meta = techResponse.data.meta;
    categoryList = catResponse.data.map((cat) => cat.name);
  } catch (error) {
    console.error("Failed to fetch technicians:", error);
  }

  return (
    <main className="bg-red-50 px-4 py-24">
      <h2 className="mb-8 text-center text-3xl font-bold">
        Browse All Technicians
      </h2>

      <div className="mx-auto max-w-7xl">
        <TechniciansFiltersWrapper
          categories={categoryList}
          currentSearch={search}
          currentCategory={category}
          currentExperience={experience}
          currentRating={rating}
          currentSort={sort}
        />

        <div className="mt-12">
          {technicians.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {technicians.map((technician) => (
                  <TechnicianCard key={technician.id} technician={technician} />
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
                No technicians found. Try adjusting your filters.
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
  if (params.experience && params.experience !== "any")
    queryParams.append("experience", String(params.experience));
  if (params.rating && params.rating !== "any")
    queryParams.append("rating", String(params.rating));
  if (params.sort) queryParams.append("sort", String(params.sort));
  queryParams.append("page", String(newPage));

  return `/technicians?${queryParams.toString()}`;
}

export default Technicians;
