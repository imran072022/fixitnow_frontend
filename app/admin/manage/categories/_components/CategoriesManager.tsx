"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Category } from "@/app/(public)/_types/categories";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "../_data/categories.client";
import {
  categorySchema,
  type CategoryFormValues,
} from "../_validation/categorySchema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await getAdminCategories();
        setCategories(response.data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load categories.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadCategories();
  }, []);

  function openCreateDialog() {
    setEditingCategory(null);
    form.reset({ name: "" });
    setIsDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    form.reset({ name: category.name });
    setIsDialogOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    try {
      const name = values.name.trim();
      const response = editingCategory
        ? await updateCategory(editingCategory.id, name)
        : await createCategory(name);
      toast.success(response.message);
      setCategories((currentCategories) =>
        editingCategory
          ? currentCategories.map((category) =>
              category.id === editingCategory.id ? response.data : category,
            )
          : [...currentCategories, response.data],
      );
      setIsDialogOpen(false);
      form.reset({ name: "" });
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save category.",
      );
    }
  }

  function onInvalid(errors: typeof form.formState.errors) {
    const message = errors.name?.message;
    toast.error(message ? String(message) : "Please enter a category name.");
  }

  async function onDelete(category: Category) {
    setDeletingCategoryId(category.id);
    try {
      const response = await deleteCategory(category.id);
      toast.success(response.message);
      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) => currentCategory.id !== category.id,
        ),
      );
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete category.",
      );
    } finally {
      setDeletingCategoryId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Categories</h2>
        <Button size="lg" onClick={openCreateDialog}>
          <Plus className="size-4" />
          Create category
        </Button>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && categories.length === 0 && (
        <p className="text-sm text-muted-foreground">No categories found.</p>
      )}
      {!isLoading && !error && categories.length > 0 && (
        <div className="divide-y rounded-md border">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <p className="font-medium">{category.name}</p>

              <div className="flex items-center gap-1">
                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Update ${category.name}`}
                  className="cursor-pointer"
                  onClick={() => openEditDialog(category)}
                >
                  <Pencil className="size-4" />
                </Button>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${category.name}`}
                        className="cursor-pointer"
                        disabled={deletingCategoryId === category.id}
                      />
                    }
                  >
                    <Trash2 className="size-4" />
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete {category.name}?
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this category.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel className={"cursor-pointer"}>
                        Cancel
                      </AlertDialogCancel>

                      <AlertDialogAction
                        className={"cursor-pointer"}
                        onClick={() => onDelete(category)}
                        disabled={deletingCategoryId === category.id}
                      >
                        {deletingCategoryId === category.id
                          ? "Deleting..."
                          : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Update category" : "Create category"}
            </DialogTitle>
            <DialogDescription>
              Enter a name for this service category.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <label className="grid gap-2 text-sm font-medium">
              Name
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Input {...field} value={field.value ?? ""} autoFocus />
                )}
              />
              {form.formState.errors.name?.message && (
                <span className="text-sm font-normal text-destructive">
                  {form.formState.errors.name.message}
                </span>
              )}
            </label>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className={"cursor-pointer"}
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={"cursor-pointer"}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
