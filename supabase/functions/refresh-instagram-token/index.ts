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

    // 2. Overí že token stále funguje volaním Instagram API
    const verifyUrl =
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${tokenRow.account_id}` +
      `?fields=id,username&access_token=${currentToken}`;

    const verifyResponse = await fetch(verifyUrl);
    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || verifyData.error) {
      throw new Error(
        verifyData.error?.message ||
        'Token verification failed. Generate a new Page token manually in Meta Developer Console.'
      );
    }

    // Page token je permanentný — nastavíme expires_at na +60 dní a aktualizujeme last_refreshed_at
    const newExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

    // 3. Aktualizuj DB
    const { error: updateError } = await supabase
      .from('instagram_tokens')
      .update({
        expires_at: newExpiresAt,
        last_refreshed_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (updateError) {
      throw new Error(`Failed to save new token: ${updateError.message}`);
    }

    console.log(`[Instagram Refresh] Token verified OK. Expires at: ${newExpiresAt}`);

    return new Response(
      JSON.stringify({
        success: true,
        expires_at: newExpiresAt,
        expires_in_days: 60,
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
