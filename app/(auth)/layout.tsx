import React from "react";

const AuthLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1 bg-amber-50 ">{children}</div>
      <div className="flex-1 bg-green-50"></div>
    </div>
  );
};

export default AuthLayout;
