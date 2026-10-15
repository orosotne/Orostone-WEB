import assert from 'node:assert/strict';
import test from 'node:test';
import { buildProductJsonLd, shippingDetailsForStock } from '../../lib/productSchema';

test('only in-stock slabs advertise delivery within 3–5 business days', () => {
  const stocked = shippingDetailsForStock(true);
  for (const option of stocked) {
    assert.ok('deliveryTime' in option);
    const { handlingTime, transitTime, businessDays } = option.deliveryTime;
    assert.equal(handlingTime.minValue + transitTime.minValue, 3);
    assert.equal(handlingTime.maxValue + transitTime.maxValue, 5);
    assert.deepEqual(businessDays.dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  }

  for (const inStock of [false, undefined]) {
    const unavailable = shippingDetailsForStock(inStock);
    assert.ok(unavailable.every((option) => !('deliveryTime' in option)));
    assert.deepEqual(unavailable, stocked.map(({ deliveryTime, ...option }) => option));
  }
});

test('product offers retain rates but omit the stock delivery window for preorders', () => {
  const product = {
    id: 'test-slab', name: 'Test slab', image: '/test-slab.jpg',
    dimensions: '3200 x 1600 mm', pricePerM2: 100,
  };
  const offer = (inStock: boolean) => buildProductJsonLd(
    { ...product, inStock }, { countryOfOrigin: 'CN', totalPrice: 512 },
  ).offers as { availability: string; shippingDetails: unknown; price: string };
  assert.equal(offer(false).availability, 'https://schema.org/PreOrder');
  assert.equal(offer(false).price, offer(true).price);
  assert.deepEqual(offer(false).shippingDetails, shippingDetailsForStock(false));
  assert.deepEqual(offer(true).shippingDetails, shippingDetailsForStock(true));
});
