// This script is for demonstration purposes to help diagnose the Supabase authentication issue
// with the demo user. It shows how to create a user in Supabase and should be run using Node.js.

// Note: You should run this script using Node.js with the @supabase/supabase-js package installed

const { createClient } = require('@supabase/supabase-js');

// These values are from your .env file and client.ts
const SUPABASE_URL = "https://cuhdnyvhujechpurjveb.supabase.co";
const SUPABASE_SERVICE_KEY = "YOUR_SUPABASE_SERVICE_KEY"; // Replace with your service/admin key from Supabase dashboard

// Create a Supabase client with the service key (admin privileges)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createDemoUser() {
  try {
    // First check if the user already exists
    const { data: existingUsers, error: fetchError } = await supabaseAdmin
      .from('auth.users')
      .select('*')
      .eq('email', 'demo@pebblepay.com');
    
    if (fetchError) {
      console.error('Error checking for existing user:', fetchError);
      return;
    }

    if (existingUsers && existingUsers.length > 0) {
      console.log('Demo user already exists in Supabase');
      
      // Option to reset password if needed
      const { error: resetError } = await supabaseAdmin
        .auth
        .admin
        .updateUserById(existingUsers[0].id, { password: 'demo123' });
      
      if (resetError) {
        console.error('Error resetting demo user password:', resetError);
      } else {
        console.log('Demo user password has been reset to "demo123"');
      }
      return;
    }

    // Create the demo user if it doesn't exist
    const { data, error } = await supabaseAdmin
      .auth
      .admin
      .createUser({
        email: 'demo@pebblepay.com',
        password: 'demo123',
        email_confirm: true, // Auto-confirm email
        user_metadata: { 
          first_name: 'Demo',
          last_name: 'User'
        }
      });

    if (error) {
      console.error('Error creating demo user:', error);
      return;
    }

    console.log('Demo user created successfully:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the function
createDemoUser();