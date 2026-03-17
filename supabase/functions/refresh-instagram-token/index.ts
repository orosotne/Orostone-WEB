import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GRAPH_API_VERSION = 'v24.0';

serve(async (req) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Načítaj aktuálny token z DB
    const { data: tokenRow, error: fetchError } = await supabase
      .from('instagram_tokens')
      .select('*')
      .eq('id', 1)
      .single();

    if (fetchError || !tokenRow) {
      throw new Error(`Token not found in DB: ${fetchError?.message}`);
    }

    const currentToken = tokenRow.access_token;
    const expiresAt = new Date(tokenRow.expires_at);
    const now = new Date();

    // 2. Skontroluj či token ešte nie je expirnutý
    if (now > expiresAt) {
      console.error('[Instagram Refresh] Token already expired! Manual re-auth needed.');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token expired. Generate a new long-lived token manually in Meta Developer Console.',
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Zavolaj Facebook Graph API na refresh
    const refreshUrl =
      `https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${Deno.env.get('INSTAGRAM_APP_ID')}` +
      `&client_secret=${Deno.env.get('INSTAGRAM_APP_SECRET')}` +
      `&fb_exchange_token=${currentToken}`;

    const response = await fetch(refreshUrl);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || `Refresh failed: ${response.status}`);
    }

    const newToken = data.access_token;
    const expiresInSeconds = data.expires_in || 5184000; // default 60 dní
    const newExpiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    // 4. Ulož nový token do DB
    const { error: updateError } = await supabase
      .from('instagram_tokens')
      .update({
        access_token: newToken,
        expires_at: newExpiresAt,
        last_refreshed_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (updateError) {
      throw new Error(`Failed to save new token: ${updateError.message}`);
    }

    console.log(`[Instagram Refresh] Token refreshed. Expires at: ${newExpiresAt}`);

    return new Response(
      JSON.stringify({
        success: true,
        expires_at: newExpiresAt,
        expires_in_days: Math.floor(expiresInSeconds / 86400),
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('[Instagram Refresh] Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
