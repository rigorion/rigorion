import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Academia</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;