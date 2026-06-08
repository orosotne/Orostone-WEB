export interface BundleOption {
  quantity: number;
  discountPercent: number;
  label: string;
  isBestValue?: boolean;
}

export const BUNDLE_OPTIONS: BundleOption[] = [
  { quantity: 1, discountPercent: 0, label: 'štandard' },
  { quantity: 2, discountPercent: 20, label: '-20%' },
  { quantity: 3, discountPercent: 30, label: '-30%', isBestValue: true },
];

export const INSTALLATION_RATE_PER_M2 = 279; // EUR per m² VAT incl.
export const INSTALLATION_STORAGE_KEY = 'orostone_installation_data';

export interface InstallationData {
  installation_selected: boolean;
  installation_area_m2: number;
  installation_price_estimate_vat: number;
  installation_pricing_basis: string;
  installation_disclaimer: string;
  product_id: string;
  product_name: string;
}

export const saveInstallationToStorage = (data: InstallationData | null): void => {
  if (data) {
    localStorage.setItem(INSTALLATION_STORAGE_KEY, JSON.stringify(data));
  } else {
    localStorage.removeItem(INSTALLATION_STORAGE_KEY);
  }
};

export const loadInstallationFromStorage = (): InstallationData | null => {
  try {
    const raw = localStorage.getItem(INSTALLATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
