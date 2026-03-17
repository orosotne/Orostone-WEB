import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GRAPH_API_VERSION = 'v24.0';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

serve(async (req) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '8'), 25);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Načítaj token z DB
    const { data: tokenRow, error: fetchError } = await supabase
      .from('instagram_tokens')
      .select('access_token, account_id, expires_at')
      .eq('id', 1)
      .single();

    if (fetchError || !tokenRow) {
      throw new Error(`Token not found: ${fetchError?.message}`);
    }

    // Skontroluj expiráciu
    if (new Date() > new Date(tokenRow.expires_at)) {
      throw new Error('Token expired');
    }

    // Zavolaj Instagram API
    const igUrl =
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${tokenRow.account_id}/media` +
      `?fields=${FIELDS}&limit=${limit}&access_token=${tokenRow.access_token}`;

    const igResponse = await fetch(igUrl);

    if (!igResponse.ok) {
      const errData = await igResponse.json().catch(() => null);
      throw new Error(errData?.error?.message || `Instagram API: ${igResponse.status}`);
    }

    const igData = await igResponse.json();

    return new Response(
      JSON.stringify({ data: igData.data || [] }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    );
  } catch (error) {
    console.error('[Instagram Feed] Error:', error.message);
    return new Response(
      JSON.stringify({ data: [], error: error.message }),
      { status: 200, headers: corsHeaders }
    );
  }
});
