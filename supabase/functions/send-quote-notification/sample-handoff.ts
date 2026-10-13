/** Direct server handoff; sample confirmation does not wait for Gmail polling. */
export async function handoffSample(
  quote: { id: string; decor: string | null; created_at: string },
  customer: { email: string; name: string; phone: string | null },
  secret: string | undefined,
): Promise<void> {
  if (!secret) throw new Error('SAMPLE_INGEST_SECRET is not configured');
  const response = await fetch('https://crm.orostone.sk/api/sample-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-webhook-secret': secret },
    body: JSON.stringify({quote_id:quote.id,email:customer.email,name:customer.name,
      phone:customer.phone ?? '',decor:quote.decor ?? '',created_at:quote.created_at}),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('CRM sample handoff failed');
  const result = await response.json();
  if (result?.ok !== true || typeof result?.lead_id !== 'string') throw new Error('CRM did not confirm durable sample acceptance');
}
