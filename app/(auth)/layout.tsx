const AuthLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row bg-gradient-to-r from-blue-50 to-red-50">
        <div className="flex-1">{children}</div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};
export default AuthLayout;
