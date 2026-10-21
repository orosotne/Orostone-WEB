// Stav objednávky vzoriek na ceste zákazník → Alfapureo → GLS. Bez importov z Deno, testuje ho
// scripts/tests/sample-status.test.ts. Údaje: objednávka zo Shopify Admin API a riadok
// z tabuľky alfapureo_forwarding (zapisuje alfapureo-order). Výstup je bez osobných údajov.

export type Attribute = { key: string; value: string };

export type ShopifyOrder = {
  legacyResourceId: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string | null;
  cancelledAt: string | null;
  customAttributes: Attribute[];
  lineItems: { nodes: Array<{ customAttributes: Attribute[] }> };
  fulfillments: Array<{
    createdAt: string;
    deliveredAt: string | null;
    trackingInfo: Array<{ number: string | null; url: string | null }>;
  }>;
};

export type Forwarding = {
  order_id: number | string;
  forwarded_at: string | null;
  last_attempt_at: string;
  last_http_status: number | null;
  last_attempts: number;
  last_error: string | null;
};

/** Kde objednávka je, v poradí cesty. */
export type Stage = 'cancelled' | 'unpaid' | 'not_forwarded' | 'at_alfapureo' | 'shipped' | 'delivered';

export type SampleOrder = {
  order: string;
  orderedAt: string;
  samples: string[];
  stage: Stage;
  /** Prečo objednávka viazne (slovensky, do prehľadu aj e-mailu), inak null. */
  stuck: string | null;
  alfapureo: {
    forwardedAt: string | null;
    lastAttemptAt: string;
    httpStatus: number | null;
    attempts: number;
    error: string | null;
  } | null;
  shipped: { at: string; trackingNumber: string | null; trackingUrl: string | null } | null;
  deliveredAt: string | null;
  adminUrl: string;
};

/** Zaplatená objednávka vzoriek bez záznamu o Alfapureo je po tomto čase podozrivá. */
export const FORWARD_GRACE_MS = 30 * 60 * 1000;
/** Koľko pracovných dní (po–pi) smie byť objednávka v Alfapureo bez odoslania. */
export const SHIP_WORKDAYS = 2;

const PAID = new Set(['PAID', 'PARTIALLY_REFUNDED']);
const CANCELLED = new Set(['REFUNDED', 'VOIDED']);

export function isSampleOrder(order: Pick<ShopifyOrder, 'customAttributes'>): boolean {
  return order.customAttributes.some(a => a.key === '_orostone_flow' && a.value === 'samples');
}

/** Dekory z vlastností „Vzorka 1“, „Vzorka 2“… (services/shopify/samples.ts). */
export function sampleNames(order: Pick<ShopifyOrder, 'lineItems'>): string[] {
  return order.lineItems.nodes.flatMap(item => item.customAttributes
    .filter(a => /^Vzorka \d+$/.test(a.key))
    .sort((a, b) => Number(a.key.slice(7)) - Number(b.key.slice(7)))
    .map(a => a.value));
}

/** `from` posunutý o `days` pracovných dní (sobotu a nedeľu preskočí, sviatky nie). */
export function addWorkdays(from: Date, days: number): Date {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

function daysWaiting(since: Date, now: Date): number {
  return Math.max(1, Math.floor((now.getTime() - since.getTime()) / 86_400_000));
}

export function sampleStatus(order: ShopifyOrder, forwarding: Forwarding | undefined, now: Date, shop: string): SampleOrder {
  const fulfillment = order.fulfillments
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .pop();
  const tracking = fulfillment?.trackingInfo.find(t => t.url || t.number);
  const deliveredAt = fulfillment?.deliveredAt ?? null;

  let stage: Stage;
  if (order.cancelledAt || CANCELLED.has(order.displayFinancialStatus ?? '')) stage = 'cancelled';
  else if (deliveredAt) stage = 'delivered';
  else if (fulfillment) stage = 'shipped';
  else if (!PAID.has(order.displayFinancialStatus ?? '')) stage = 'unpaid';
  else if (forwarding?.forwarded_at) stage = 'at_alfapureo';
  else stage = 'not_forwarded';

  let stuck: string | null = null;
  if (stage === 'not_forwarded') {
    if (forwarding) {
      const reason = forwarding.last_http_status ? `HTTP ${forwarding.last_http_status}` : forwarding.last_error ?? 'bez odpovede';
      stuck = `Alfapureo objednávku neprijalo (${reason}, ${forwarding.last_attempts}× pokus). Treba ju poslať ručne.`;
    } else if (now.getTime() - new Date(order.createdAt).getTime() > FORWARD_GRACE_MS) {
      stuck = 'Nedorazila do Alfapurea, funkcia alfapureo-order o nej nevie (webhook zo Shopify neprišiel alebo bol odmietnutý).';
    }
  } else if (stage === 'at_alfapureo' && forwarding?.forwarded_at) {
    const since = new Date(forwarding.forwarded_at);
    if (now > addWorkdays(since, SHIP_WORKDAYS)) {
      stuck = `V Alfapureo čaká na odoslanie ${daysWaiting(since, now)} d, číslo zásielky GLS zatiaľ neprišlo.`;
    }
  }

  return {
    order: order.name,
    orderedAt: order.createdAt,
    samples: sampleNames(order),
    stage,
    stuck,
    alfapureo: forwarding
      ? {
        forwardedAt: forwarding.forwarded_at,
        lastAttemptAt: forwarding.last_attempt_at,
        httpStatus: forwarding.last_http_status,
        attempts: forwarding.last_attempts,
        error: forwarding.last_error,
      }
      : null,
    shipped: fulfillment
      ? { at: fulfillment.createdAt, trackingNumber: tracking?.number ?? null, trackingUrl: tracking?.url ?? null }
      : null,
    deliveredAt,
    adminUrl: `https://${shop}/admin/orders/${order.legacyResourceId}`,
  };
}
