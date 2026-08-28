"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
};
export type filtersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  experience: string;
  onExperienceChange: (value: string) => void;
  rating: string;
  onRatingChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  categories?: string[];
};
const experiences = [
  ["any", "Any experience"],
  ["1", "1+ years"],
  ["3", "3+ years"],
  ["5", "5+ years"],
  ["10", "10+ years"],
];
const ratings = [
  ["any", "Any rating"],
  ["3", "3+ stars"],
  ["4", "4+ stars"],
  ["4.5", "4.5+ stars"],
];
const sorts = [
  ["rating-desc", "Rating: high to low"],
  ["rating-asc", "Rating: low to high"],
  ["experience-desc", "Experience: high to low"],
  ["experience-asc", "Experience: low to high"],
];

function CategorySelect({
  value,
  onValueChange,
  categories = [],
}: FilterSelectProps & { categories?: string[] }) {
  return (
    <Select value={value} onValueChange={(v) => v !== null && onValueChange(v)}>
      <SelectTrigger
        aria-label="Category"
        className="w-full bg-background sm:w-48"
      >
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
function OptionSelect({
  label,
  value,
  onValueChange,
  options,
}: FilterSelectProps & { label: string; options: string[][] }) {
  return (
    <Select value={value} onValueChange={(v) => v !== null && onValueChange(v)}>
      <SelectTrigger
        aria-label={label}
        className="w-full bg-background sm:w-48"
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TechnicianFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  experience,
  onExperienceChange,
  rating,
  onRatingChange,
  sort,
  onSortChange,
  categories,
}: filtersProps) {
  const filterControls = (
    <>
      <CategorySelect
        value={category}
        onValueChange={onCategoryChange}
        categories={categories}
      />
      <OptionSelect
        label="Minimum experience"
        value={experience}
        onValueChange={onExperienceChange}
        options={experiences}
      />
      <OptionSelect
        label="Minimum rating"
        value={rating}
        onValueChange={onRatingChange}
        options={ratings}
      />
    </>
  );
  return (
    <section
      aria-label="Technician search and filters"
      className="flex flex-col gap-3"
    >
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search technicians, services, or location..."
          className="h-12 pl-10 text-sm shadow-sm"
        />
      </div>
      <div className="hidden items-center gap-3 lg:flex">
        {filterControls}
        <div className="ml-auto">
          <OptionSelect
            label="Sort by"
            value={sort}
            onValueChange={onSortChange}
            options={sorts}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 lg:hidden">
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 sm:flex-none",
            )}
          >
            <SlidersHorizontal data-icon="inline-start" />
            Filters
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filter technicians</SheetTitle>
              <SheetDescription>
                Refine the technicians shown in your search.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3 px-4 pb-6">
              {filterControls}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <OptionSelect
            label="Sort by"
            value={sort}
            onValueChange={onSortChange}
            options={sorts}
          />
        </div>
      </div>
    </section>
  );
}
export const filterDefaults = {
  category: "all",
  experience: "any",
  rating: "any",
  sort: "desc",
};
