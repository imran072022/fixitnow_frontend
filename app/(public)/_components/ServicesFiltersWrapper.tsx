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
  const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
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

  // Debounce text and numeric filter changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (
        localSearch !== currentSearch ||
        localMinPrice !== currentMinPrice ||
        localMaxPrice !== currentMaxPrice
      ) {
        handleFilterChange({
          search: localSearch,
          category: currentCategory,
          minPrice: localMinPrice,
          maxPrice: localMaxPrice,
          sort: currentSort,
        });
      }
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    localSearch,
    localMinPrice,
    localMaxPrice,
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
        minPrice={localMinPrice}
        onMinPriceChange={setLocalMinPrice}
        maxPrice={localMaxPrice}
        onMaxPriceChange={setLocalMaxPrice}
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
