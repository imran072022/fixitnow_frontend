import React from "react";

const CustomerLayout = async ({ children }: LayoutProps<"/">) => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Full-width main background */}
      <main className="flex-1">
        {/* 1280px content area */}
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>

      {/* Full-width */}
      <footer className="border-t">
        {/* 1280px footer content */}
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">Footer</div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
