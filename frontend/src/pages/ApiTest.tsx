import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { devicesService, analyticsService } from '@/services/api';

const ApiTest = () => {
  const { user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [djangoProfile, setDjangoProfile] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDjangoConnection = async () => {
    setBackendStatus('loading');
    setError(null);
    
    try {
      // Test connection to Django backend
      const response = await fetch('http://localhost:8000/api/auth/test/');
      const data = await response.json();
      
      setMessage(data.message);
      setBackendStatus('success');
    } catch (err) {
      console.error('Error connecting to backend:', err);
      setBackendStatus('error');
      setError('Failed to connect to Django backend. Make sure the server is running.');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await useAuth().getDjangoProfile();
      setDjangoProfile(profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch user profile. You may not be authenticated.');
    }
  };

  const fetchDevices = async () => {
    try {
      const data = await devicesService.getAllDevices();
      setDevices((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to fetch devices.');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsService.getDashboardData();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics data.');
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">API Integration Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Django Backend Connection Test</CardTitle>
          <CardDescription>
            Test the connection to the Django backend server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button onClick={testDjangoConnection} disabled={backendStatus === 'loading'}>
              {backendStatus === 'loading' ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {backendStatus === 'success' && (
              <div className="text-success font-medium">
                Success: {message}
              </div>
            )}
            
            {backendStatus === 'error' && (
              <div className="text-destructive font-medium">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>
            Current user authentication status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Supabase Authentication:</p>
            {user ? (
              <div className="p-4 bg-muted rounded-md">
                <p><span className="font-medium">User ID:</span> {user.id}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Not authenticated with Supabase</p>
            )}
          </div>

          <div>
            <p className="font-medium">Django Authentication:</p>
            <Button onClick={fetchUserProfile} variant="outline" className="mr-2">
              Fetch Django Profile
            </Button>
            
            {djangoProfile ? (
              <div className="p-4 bg-muted rounded-md mt-2">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify({
                    ...djangoProfile,
                    tokens: djangoProfile?.tokens
                  }, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">Click to fetch Django profile</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Devices API Test</CardTitle>
            <CardDescription>
              Test fetching devices from the backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchDevices} variant="outline">
              Fetch Devices
            </Button>
            
            {devices.length > 0 ? (
              <div className="p-4 bg-muted rounded-md">
                <p className="font-medium mb-2">Found {devices.length} devices:</p>
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(devices, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No devices fetched yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics API Test</CardTitle>
            <CardDescription>
              Test fetching analytics data from the backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchAnalytics} variant="outline">
              Fetch Analytics
            </Button>
            
            {analytics ? (
              <div className="p-4 bg-muted rounded-md">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(analytics, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No analytics data fetched yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ApiTest;