import { Footer } from "@/components/shared/Footer";

const PublicLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Full-width main background */}
      <main className="flex-1">
        {/* 1280px content area */}
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>

      {/* Full-width */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
