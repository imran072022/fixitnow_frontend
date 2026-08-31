const AuthLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 bg-amber-50">{children}</div>
        <div className="flex-1 bg-green-50"></div>
      </div>
    </div>
  );
};
export default AuthLayout;
