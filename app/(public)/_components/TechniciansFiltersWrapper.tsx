"use client";

import { useRouter } from "next/navigation";

import { useTransition, useState, useEffect, useRef, useCallback } from "react";
import { TechnicianFilters } from "./TechnicianFilters";

interface TechniciansFiltersWrapperProps {
  categories: string[];
  currentSearch: string;
  currentCategory: string;
  currentExperience: string;
  currentRating: string;
  currentSort: string;
}

export function TechniciansFiltersWrapper({
  categories,
  currentSearch,
  currentCategory,
  currentExperience,
  currentRating,
  currentSort,
}: TechniciansFiltersWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState(currentSearch);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string>) => {
      startTransition(() => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value && value !== "all" && value !== "any") {
            params.append(key, value);
          }
        });

        params.append("page", "1"); // Reset to page 1 on filter change

        router.push(`/technicians?${params.toString()}`);
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
          experience: currentExperience,
          rating: currentRating,
          sort: currentSort,
        });
      }
    }, 400); // 500ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    localSearch,
    currentSearch,
    currentCategory,
    currentExperience,
    currentRating,
    currentSort,
    handleFilterChange,
  ]);

  return (
    <div className={isPending ? "opacity-50" : ""}>
      <TechnicianFilters
        search={localSearch}
        onSearchChange={setLocalSearch}
        category={currentCategory}
        onCategoryChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: value,
            experience: currentExperience,
            rating: currentRating,
            sort: currentSort,
          })
        }
        experience={currentExperience}
        onExperienceChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: currentCategory,
            experience: value,
            rating: currentRating,
            sort: currentSort,
          })
        }
        rating={currentRating}
        onRatingChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: currentCategory,
            experience: currentExperience,
            rating: value,
            sort: currentSort,
          })
        }
        sort={currentSort}
        onSortChange={(value) =>
          handleFilterChange({
            search: localSearch,
            category: currentCategory,
            experience: currentExperience,
            rating: currentRating,
            sort: value,
          })
        }
        categories={categories}
      />
    </div>
  );
}
