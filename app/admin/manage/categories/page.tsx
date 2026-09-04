import { CategoriesManager } from "./_components/CategoriesManager";

const ManageCategories = () => {
  return (
    <div className="space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage categories</h1>
        <p className="mt-2 text-muted-foreground">
          Create and organize service categories.
        </p>
      </div>
      <CategoriesManager />
    </div>
  );
};

export default ManageCategories;
