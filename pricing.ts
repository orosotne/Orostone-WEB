export const PRICING = {
    // Base price per m2 explicitly for estimation
    materialBase: {
        'economy': 220,   // e.g., Unita
        'premium': 350,   // e.g., Marbelito
        'luxury': 480     // e.g., Space Black
    },
    // Multipliers or fixed costs
    processing: {
        cutoutUnpolished: 50,  // varná doska naložená
        cutoutPolished: 150,   // drez spodná montáž
        thickness20mmMultiplier: 1.3, // 30% príplatok za 20mm
        installation: 450,    // paušál montáž + doprava
        polishingPerMeter: 35 // leštenie hrany za bm
    }
};

export const MATERIAL_TIERS: Record<string, 'economy' | 'premium' | 'luxury'> = {
    'UNITA': 'economy',
    'BIANCO': 'premium',
    'MARBELITO': 'premium',
    'Space Black': 'luxury'
};
