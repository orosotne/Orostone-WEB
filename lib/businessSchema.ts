/** Shared business identity, emitted once by Vite in every prerendered page. */
export const ORGANIZATION_ID = 'https://orostone.sk/#organization';
export const SHOWROOM_ID = 'https://orostone.sk/#showroom-bosany';

// The existing Google place CID is stable when its address or map viewport changes.
export const OROSTONE_MAPS_URL = 'https://www.google.com/maps?cid=12030968938306137332';

export const OROSTONE_SELLER_LD = {
  '@id': ORGANIZATION_ID,
  '@type': 'Organization',
  name: 'OROSTONE s.r.o.',
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const OROSTONE_BUSINESS_GRAPH_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'OROSTONE',
      legalName: 'Orostone s.r.o.',
      url: 'https://orostone.sk/',
      logo: 'https://orostone.sk/images/brand/orostone-circle.png',
      description: 'Dodávateľ sinterovaného kameňa pre kuchyne, kúpeľne a architektonické projekty.',
      telephone: '+421917588738',
      email: 'info@orostone.sk',
      // Legal headquarters and commercial offices, not the slab showroom.
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Landererova 8',
        addressLocality: 'Bratislava',
        addressRegion: 'Bratislavský kraj',
        postalCode: '811 09',
        addressCountry: 'SK',
      },
      areaServed: { '@type': 'Country', name: 'Slovakia' },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+421917588738',
          contactType: 'sales',
          availableLanguage: ['Slovak', 'English'],
          email: 'dopyt@orostone.sk',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'billing support',
          email: 'info@orostone.sk',
        },
      ],
      department: { '@id': SHOWROOM_ID },
      sameAs: [
        'https://www.instagram.com/orostone_',
        'https://www.facebook.com/orostone.sk',
        'https://www.youtube.com/@OrostoneSK',
      ],
    },
    {
      '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
      '@id': SHOWROOM_ID,
      name: 'OROSTONE Showroom Bošany',
      description: 'Showroom sinterovaného kameňa v renesančnom kaštieli v Bošanoch. Celé platne si môžete pozrieť iba tu. Cez víkend po dohode. Každú návštevu si, prosím, dohodnite telefonicky aspoň 1\u00A0hodinu vopred.',
      url: 'https://orostone.sk/kontakt',
      image: 'https://orostone.sk/images/home/showroom-kastiel.webp',
      telephone: '+421917588738',
      email: 'dopyt@orostone.sk',
      parentOrganization: { '@id': ORGANIZATION_ID },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'SNP 113/1',
        addressLocality: 'Bošany',
        postalCode: '956 18',
        addressCountry: 'SK',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.580886,
        longitude: 18.248183,
      },
      hasMap: OROSTONE_MAPS_URL,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: weekdays,
          opens: '09:00',
          closes: '17:00',
        },
      ],
      priceRange: '€€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Bankový prevod, Platba kartou',
    },
  ],
};
