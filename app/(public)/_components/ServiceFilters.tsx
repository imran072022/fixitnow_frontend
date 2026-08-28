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

export type ServiceFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  categories?: string[];
};

const sorts = [
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["createdAt-desc", "Newest first"],
  ["createdAt-asc", "Oldest first"],
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

export function ServiceFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
  categories,
}: ServiceFiltersProps) {
  const filterControls = (
    <>
      <CategorySelect
        value={category}
        onValueChange={onCategoryChange}
        categories={categories}
      />
      <div className="flex w-full gap-3 sm:w-auto sm:gap-2">
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          className="h-10 text-sm"
          min="0"
        />
        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          className="h-10 text-sm"
          min="0"
        />
      </div>
    </>
  );

  return (
    <section
      aria-label="Service search and filters"
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
          placeholder="Search services, descriptions, or location..."
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
              <SheetTitle>Filter services</SheetTitle>
              <SheetDescription>
                Refine the services shown in your search.
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

export const serviceFilterDefaults = {
  category: "all",
  minPrice: "",
  maxPrice: "",
  sort: "createdAt-desc",
};
