import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ORGANIZATION_ID,
  SHOWROOM_ID,
  OROSTONE_BUSINESS_GRAPH_LD,
  OROSTONE_MAPS_URL,
} from '../../lib/businessSchema';
import { buildProductJsonLd } from '../../lib/productSchema';

test('legal headquarters and the only showroom are separate, connected entities', () => {
  const entities = OROSTONE_BUSINESS_GRAPH_LD['@graph'];
  assert.equal(new Set(entities.map((entity) => entity['@id'])).size, 2);
  const organization = entities.find((entity) => entity['@id'] === ORGANIZATION_ID)!;
  const showroom = entities.find((entity) => entity['@id'] === SHOWROOM_ID)!;
  assert.equal(organization['@type'], 'Organization');
  assert.equal(organization.address.streetAddress, 'Landererova 8');
  assert.equal(organization.address.addressLocality, 'Bratislava');
  assert.ok(!('geo' in organization));
  assert.ok(!('openingHoursSpecification' in organization));
  assert.deepEqual(organization.department, { '@id': SHOWROOM_ID });
  assert.deepEqual(showroom.parentOrganization, { '@id': ORGANIZATION_ID });
  assert.ok(showroom['@type'].includes('LocalBusiness'));
  assert.equal(showroom.address.streetAddress, 'SNP 113/1');
  assert.equal(showroom.address.addressLocality, 'Bošany');
  assert.deepEqual(showroom.geo, {
    '@type': 'GeoCoordinates', latitude: 48.580886, longitude: 18.248183,
  });
  assert.deepEqual(showroom.openingHoursSpecification, [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00', closes: '17:00',
  }]);
});

test('business identity uses confirmed social profiles and a coordinate-free Google place URL', () => {
  const organization = OROSTONE_BUSINESS_GRAPH_LD['@graph'].find((entity) => entity['@id'] === ORGANIZATION_ID)!;
  assert.deepEqual(organization.sameAs, [
    'https://www.instagram.com/orostone_',
    'https://www.facebook.com/orostone.sk',
    'https://www.youtube.com/@OrostoneSK',
  ]);
  const maps = new URL(OROSTONE_MAPS_URL);
  assert.equal(maps.hostname, 'www.google.com');
  assert.equal(maps.pathname, '/maps');
  assert.equal(maps.searchParams.get('cid'), BigInt('0xa6f69681af7eecf4').toString());
  assert.equal([...maps.searchParams].length, 1);
  assert.ok(!JSON.stringify(OROSTONE_BUSINESS_GRAPH_LD).includes('GeoCircle'));
});

test('product seller resolves to the legal organization without inventing a manufacturer', () => {
  const product = buildProductJsonLd({
    id: 'test-slab', name: 'Test slab', image: '/test-slab.jpg',
    dimensions: '3200 x 1600 mm', pricePerM2: 100, inStock: true,
  }, { countryOfOrigin: 'CN', totalPrice: 512 });
  const offer = product.offers as { seller: { '@id': string }; price: string };
  assert.equal(offer.seller['@id'], ORGANIZATION_ID);
  assert.ok(OROSTONE_BUSINESS_GRAPH_LD['@graph'].some((entity) => entity['@id'] === offer.seller['@id']));
  assert.deepEqual(product.brand, { '@type': 'Brand', name: 'OROSTONE' });
  assert.equal(offer.price, '512.00');
  assert.equal(product.countryOfOrigin, 'CN');
  assert.ok(!('manufacturer' in product));
});
