"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, createService } from "../_data/services";
import {
  createServiceSchema,
  type CreateServiceFormData,
  type CreateServiceFormInput,
} from "../_zodSchema/service";

type CreateServiceModalProps = {
  categories: Category[];
};

const CreateServiceModal = ({ categories }: CreateServiceModalProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceFormInput, undefined, CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      price: "",
    },
  });

  const categoryId = watch("categoryId");

  const onSubmit = async (data: CreateServiceFormData) => {
    try {
      await createService(data);

      toast.success("Service created successfully.");

      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create service.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) => (
          <Button {...props} className={"cursor-pointer"}>
            Create Service
          </Button>
        )}
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Service</DialogTitle>

          <DialogDescription>
            Add a service that you provide to customers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>

            <Select
              value={categoryId}
              onValueChange={(value) =>
                setValue("categoryId", value ?? "", {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {categories.find((category) => category.id === categoryId)
                    ?.name ?? "Select a category"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="service-name" className="text-sm font-medium">
              Service Name
            </label>

            <Input
              id="service-name"
              placeholder="e.g. Plumbing Repair"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="service-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="service-description"
              placeholder="Describe your service..."
              rows={4}
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label htmlFor="service-price" className="text-sm font-medium">
              Price
            </label>

            <Input
              id="service-price"
              type="number"
              min="1"
              step="1"
              placeholder="Enter price"
              {...register("price")}
            />

            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={"cursor-pointer"}
            >
              {isSubmitting ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServiceModal;
