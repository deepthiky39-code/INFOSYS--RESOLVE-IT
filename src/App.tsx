import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { ForgotPassword } from "./components/ForgotPassword";
import { UserDashboard } from "./components/UserDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AdminDashboard } from "./components/AdminDashboard";
import { AdminToggle } from "./components/AdminToggle";
import { Toaster } from "./components/ui/sonner";
import { useState } from "react";
import { ResetPassword } from "./components/ResetPassword";
export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentView, setCurrentView] = useState<"login" | "signup" | "forgot" | "userDashboard" | "adminDashboard">("login");
  const [loggedInUser, setLoggedInUser] = useState<{ email: string; name: string } | null>(null);
<Route path="/reset-password" element={<ResetPassword />} />
  const handleLogin = (email: string, isAdmin: boolean) => {
    if (isAdmin) {
      setLoggedInUser({ email, name: "Admin" });
      setCurrentView("adminDashboard");
    } else {
      setLoggedInUser({ email, name: email.split('@')[0] });
      setCurrentView("userDashboard");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView("login");
    setIsAdminMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <Toaster />
      {currentView !== "userDashboard" && currentView !== "adminDashboard" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <AdminToggle isAdminMode={isAdminMode} onToggle={setIsAdminMode} />
          {currentView === "login" && (
            <LoginForm 
              isAdminMode={isAdminMode} 
              onSignupClick={() => setCurrentView("signup")}
              onForgotPasswordClick={() => setCurrentView("forgot")}
              onLogin={handleLogin}
            />
          )}
          {currentView === "signup" && (
            <SignupForm onBackToLogin={() => setCurrentView("login")} />
          )}
          {currentView === "forgot" && (
            <ForgotPassword onBackToLogin={() => setCurrentView("login")} />
          )}
        </div>
      )}
      {currentView === "userDashboard" && loggedInUser && (
        <UserDashboard user={loggedInUser} onLogout={handleLogout} />
      )}
      {currentView === "adminDashboard" && loggedInUser && (
        <AdminDashboard user={loggedInUser} onLogout={handleLogout} />
      )}
    </div>
  );
  
}