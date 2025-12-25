import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Lock, Mail, Bus, Shield } from "lucide-react";

interface LoginFormProps {
  isAdminMode: boolean;
  onForgotPasswordClick: () => void;
  onSignupClick: () => void;
  onLogin: (email: string, isAdminMode: boolean) => void;
}

export function LoginForm({
  isAdminMode,
  onForgotPasswordClick,
  onSignupClick,
  onLogin,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ ADDED: login API
  const loginUser = async () => {
    const endpoint = isAdminMode
      ? "http://noble-adventure-production.up.railway.app/api/auth/admin/login"
      : "http://noble-adventure-production.up.railway.app/api/auth/login";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return res.json();
  };

  // ✅ MODIFIED: now actually logs in + stores token
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser();

      // 🔐 STORE TOKEN (this fixes "Please login again")
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("role", data.role);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      onLogin(email, isAdminMode);
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <Card className="w-full max-w-md bg-white text-black shadow-lg border">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <div
            className={`${
              isAdminMode ? "bg-red-600" : "bg-orange-600"
            } p-3 rounded-full`}
          >
            {isAdminMode ? (
              <Shield className="size-8 text-white" />
            ) : (
              <Bus className="size-8 text-white" />
            )}
          </div>
        </div>
        <CardTitle className="text-center">
          {isAdminMode
            ? "Administrator Portal"
            : "Public Transport Grievance System"}
        </CardTitle>
        <CardDescription className="text-center text-gray-500">
          {isAdminMode
            ? "Admin login to manage grievances and system"
            : "Sign in to submit or manage transport complaints"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isAdminMode && (
                <a
                  href="#"
                  className="text-sm text-orange-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    onForgotPasswordClick();
                  }}
                >
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setRememberMe(checked as boolean)
              }
            />
            <label htmlFor="remember" className="text-sm">
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            className={`w-full ${
              isAdminMode
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            Login
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        {!isAdminMode ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-orange-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                onSignupClick();
              }}
            >
              Sign up
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-gray-700">
              Contact your administrator
            </span>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
