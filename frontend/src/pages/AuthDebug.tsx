import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const AuthDebug = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const { user, session, signOut } = useAuth();
  const { toast } = useToast();

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Session Error",
          description: error.message,
        });
      } else {
        setSessionInfo(data);
        toast({
          title: "Session Fetched",
          description: data.session ? "Active session found" : "No active session",
        });
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setAuthError(err.message);
    }
  };

  useEffect(() => {
    fetchSession();
    
    // Set up an auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      fetchSession();
      
      toast({
        title: "Auth State Changed",
        description: `Event: ${event}`,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleSignOut = async () => {
    await signOut();
    fetchSession();
  };

  const renderJson = (obj: any) => {
    return (
      <pre className="text-xs overflow-auto max-h-80 p-4 bg-muted rounded-md">
        {JSON.stringify(obj, null, 2)}
      </pre>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-3xl py-10 space-y-6 flex-grow">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Auth Debug</CardTitle>
            <CardDescription>
              This page helps debug authentication issues by showing the current auth state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <Button onClick={fetchSession}>Refresh Session</Button>
              {session && <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current User</h3>
              {user ? renderJson(user) : <p>No user is currently signed in</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Session</h3>
              {sessionInfo?.session ? renderJson(sessionInfo.session) : <p>No active session</p>}
            </div>

            {authError && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">Auth Error</h3>
                <p className="text-destructive">{authError}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Environment Information</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Current Origin: <code>{window.location.origin}</code></li>
                <li>Supabase URL: <code>{import.meta.env.VITE_SUPABASE_URL || 'Not set'}</code></li>
                <li>API URL: <code>{import.meta.env.VITE_API_URL || 'Not set'}</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AuthDebug;