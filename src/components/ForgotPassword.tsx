import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Mail, Bus, ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset request for:", email);
    // Add your forgot password logic here
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-orange-600 p-3 rounded-full">
            <Bus className="size-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          {isSubmitted 
            ? "Check your email for reset instructions" 
            : "Enter your email to reset your password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
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
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">
              We've sent a password reset link to <span className="font-medium">{email}</span>. 
              Please check your inbox and follow the instructions.
            </p>
            <Button 
              onClick={onBackToLogin} 
              className="bg-orange-600 hover:bg-orange-700"
            >
              Back to Login
            </Button>
          </div>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="flex justify-center">
          <Button 
            variant="ghost" 
            className="text-sm text-gray-600 hover:text-orange-600"
            onClick={onBackToLogin}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Login
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
