
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryProvider } from "./components/ReactQueryProvider";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Welcome from "./pages/Welcome";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/welcome", element: <Welcome /> },
  { path: "/landing", element: <Index /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/practice", element: <ProtectedRoute><Practice /></ProtectedRoute> },
  { path: "/progress", element: <ProtectedRoute><Progress /></ProtectedRoute> },
  { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
  { path: "/about", element: <About /> },
  { path: "/payment", element: <Payment /> },
  { path: "/payment-success", element: <PaymentSuccess /> },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster closeButton position="bottom-right" />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
