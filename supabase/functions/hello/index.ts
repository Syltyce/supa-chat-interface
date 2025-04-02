
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.info('Hello server started');

// Define the CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
  'Connection': 'keep-alive'
};

// Handle the request
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { name } = await req.json();
    const data = {
      message: `Hello ${name}!`
    };
    
    // Return the greeting message
    return new Response(
      JSON.stringify(data),
      { headers: corsHeaders }
    );
  } catch (error) {
    // Return error response if something goes wrong
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: corsHeaders 
      }
    );
  }
});
