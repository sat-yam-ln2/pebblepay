import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthDebugDirect = () => {
  const [email, setEmail] = useState('demo@pebblepay.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Debug info
      console.log('Attempting to sign in with Supabase directly');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password.replace(/./g, '*')}`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        setError(error);
      } else {
        console.log('Supabase login success:', data);
        setResult(data);
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Auth Debug</h1>
            <p className="text-muted-foreground">Test Supabase authentication directly</p>
          </div>

          <form onSubmit={handleSupabaseLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Test Supabase Login'}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-md bg-destructive/10 border border-destructive text-destructive">
              <h3 className="font-semibold">Error</h3>
              <pre className="text-xs mt-2 whitespace-pre-wrap">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-md bg-success/10 border border-success text-success">
              <h3 className="font-semibold">Success</h3>
              <pre className="text-xs mt-2 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-4">
            <p>Debug Information:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Using Supabase Authentication with PKCE flow
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugDirect;