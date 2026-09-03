import { getCategories } from "../../_data/services";
import CreateServiceModal from "../../_modals/CreateServiceModal";

const TechnicianServices = async () => {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Services</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage the services you provide.
          </p>
        </div>

        <CreateServiceModal categories={categories} />
      </div>
    </main>
  );
};

export default TechnicianServices;
