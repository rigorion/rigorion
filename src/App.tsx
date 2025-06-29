
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Practice from "@/pages/Practice";
import Progress from "@/pages/Progress";
import About from "@/pages/About";
import Chat from "@/pages/Chat";
import Welcome from "@/pages/Welcome";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Endpoints from "@/pages/Endpoints";

function App() {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/practice" element={
                  <ProtectedRoute>
                    <Practice />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } />
                <Route path="/about" element={<About />} />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                <Route path="/payment" element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } />
                <Route path="/payment-success" element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                } />
                <Route path="/endpoints" element={
                  <ProtectedRoute>
                    <Endpoints />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
