import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AuthRedirect = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your account...");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Check if we have a session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        console.log("Auth redirect session check:", data);

        if (error) {
          console.error("Error getting session:", error);
          setStatus("error");
          setMessage("There was a problem verifying your account. Please try again.");
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: error.message,
          });
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage("Your account has been verified successfully!");
          toast({
            title: "Account verified",
            description: "Your email has been verified. You're now signed in.",
          });
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          // No session but no error either, might be another type of auth flow
          setStatus("loading");
          setMessage("Still processing your verification...");
          
          // Try again in a moment or redirect to login
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (err) {
        console.error("Auth redirect error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try logging in manually.");
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "There was a problem processing your verification.",
        });
      }
    };

    // If user is already logged in, go to dashboard
    if (user) {
      navigate("/dashboard");
      return;
    }

    // Check for auth redirect
    handleAuthRedirect();
  }, [navigate, toast, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Authentication {status === "success" ? "Successful" : "in Progress"}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          
          {status === "error" && (
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          )}
          
          {status === "success" && (
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Continue to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthRedirect;