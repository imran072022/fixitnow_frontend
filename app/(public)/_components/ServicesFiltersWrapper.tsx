"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect, useRef, useCallback } from "react";
import { ServiceFilters } from "./ServiceFilters";

interface ServicesFiltersWrapperProps {
  categories: string[];
  currentSearch: string;
  currentCategory: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentSort: string;
}

export function ServicesFiltersWrapper({
  categories,
  currentSearch,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
}: ServicesFiltersWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string>) => {
      startTransition(() => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value && value !== "all") {
            params.append(key, value);
          }
        });

        params.append("page", "1"); // Reset to page 1 on filter change

        router.push(`/services?${params.toString()}`);
      });
    },
    [router],
  );

  // Debounce search changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (localSearch !== currentSearch) {
        handleFilterChange({
          search: localSearch,
          category: currentCategory,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          sort: currentSort,
        });
      }
    }, 300); // 1 second debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    localSearch,
    currentSearch,
    currentCategory,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
    handleFilterChange,
  ]);

  return (
    <div className={isPending ? "opacity-50" : ""}>
      <ServiceFilters
        search={localSearch}
        onSearchChange={setLocalSearch}
        category={currentCategory}
        onCategoryChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: value,
            minPrice: currentMinPrice,
            maxPrice: currentMaxPrice,
            sort: currentSort,
          })
        }
        minPrice={currentMinPrice}
        onMinPriceChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: currentCategory,
            minPrice: value,
            maxPrice: currentMaxPrice,
            sort: currentSort,
          })
        }
        maxPrice={currentMaxPrice}
        onMaxPriceChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: currentCategory,
            minPrice: currentMinPrice,
            maxPrice: value,
            sort: currentSort,
          })
        }
        sort={currentSort}
        onSortChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: currentCategory,
            minPrice: currentMinPrice,
            maxPrice: currentMaxPrice,
            sort: value,
          })
        }
        categories={categories}
      />
    </div>
  );
}
