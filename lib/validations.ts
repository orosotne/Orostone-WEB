import { z } from 'zod';

// ===========================================
// SPOLOČNÉ VALIDÁTORY
// ===========================================

/** Slovenské telefónne číslo — +421 alebo 09xx formát */
const phoneRegex = /^(\+421\s?)?[0-9\s]{9,15}$/;

/** Slovenské PSČ — 5 číslic, voliteľná medzera */
const postalCodeRegex = /^\d{3}\s?\d{2}$/;

// ===========================================
// AUTH SCHÉMY
// ===========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email je povinný')
    .email('Neplatný formát emailu'),
  password: z
    .string()
    .min(1, 'Heslo je povinné'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Meno musí mať aspoň 2 znaky')
    .max(100, 'Meno je príliš dlhé'),
  email: z
    .string()
    .min(1, 'Email je povinný')
    .email('Neplatný formát emailu'),
  password: z
    .string()
    .min(8, 'Heslo musí mať aspoň 8 znakov')
    .regex(/[A-Z]/, 'Heslo musí obsahovať veľké písmeno')
    .regex(/[a-z]/, 'Heslo musí obsahovať malé písmeno')
    .regex(/[0-9]/, 'Heslo musí obsahovať číslo'),
  confirmPassword: z
    .string()
    .min(1, 'Potvrdenie hesla je povinné'),
  agreedToTerms: z
    .literal(true, { errorMap: () => ({ message: 'Musíte súhlasiť s obchodnými podmienkami' }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Heslá sa nezhodujú',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// ===========================================
// CHECKOUT / SHIPPING SCHÉMA
// ===========================================

export const shippingSchema = z.object({
  name: z
    .string()
    .min(2, 'Meno musí mať aspoň 2 znaky')
    .max(100, 'Meno je príliš dlhé'),
  email: z
    .string()
    .min(1, 'Email je povinný')
    .email('Neplatný formát emailu'),
  phone: z
    .string()
    .min(1, 'Telefón je povinný')
    .regex(phoneRegex, 'Neplatný formát telefónu (napr. +421 900 123 456)'),
  street: z
    .string()
    .min(3, 'Ulica je povinná')
    .max(200, 'Ulica je príliš dlhá'),
  city: z
    .string()
    .min(2, 'Mesto je povinné')
    .max(100, 'Mesto je príliš dlhé'),
  postalCode: z
    .string()
    .min(1, 'PSČ je povinné')
    .regex(postalCodeRegex, 'Neplatné PSČ (napr. 811 01)'),
  country: z
    .string()
    .default('SK'),
  note: z
    .string()
    .max(500, 'Poznámka je príliš dlhá')
    .optional(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

// ===========================================
// ORDER MODAL (DOPYT) SCHÉMA
// ===========================================

export const orderInquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z
    .string()
    .min(1, 'Email je povinný')
    .email('Neplatný formát emailu'),
  phone: z
    .string()
    .min(1, 'Telefón je povinný')
    .regex(phoneRegex, 'Neplatný formát telefónu'),
  note: z
    .string()
    .max(1000, 'Poznámka je príliš dlhá')
    .optional(),
  quantity: z
    .number()
    .min(1, 'Minimálne 1 platňa')
    .max(100, 'Maximálne 100 platní'),
  agreedToVOP: z
    .literal(true, { errorMap: () => ({ message: 'Musíte súhlasiť s VOP' }) }),
});

export type OrderInquiryFormData = z.infer<typeof orderInquirySchema>;

// ===========================================
// ADRESA SCHÉMA
// ===========================================

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  name: z
    .string()
    .min(2, 'Meno musí mať aspoň 2 znaky'),
  street: z
    .string()
    .min(3, 'Ulica je povinná'),
  city: z
    .string()
    .min(2, 'Mesto je povinné'),
  postal_code: z
    .string()
    .min(1, 'PSČ je povinné')
    .regex(postalCodeRegex, 'Neplatné PSČ (napr. 811 01)'),
  country: z.string().default('SK'),
  phone: z
    .string()
    .regex(phoneRegex, 'Neplatný formát telefónu')
    .optional()
    .or(z.literal('')),
  is_default_shipping: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// ===========================================
// PAYMENT INTENT SCHÉMA (pre Edge Function)
// ===========================================

export const paymentIntentSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    price: z.number().positive('Cena musí byť kladná'),
    quantity: z.number().int().positive('Množstvo musí byť kladné celé číslo'),
    surfaceArea: z.number().positive().optional(),
  })).min(1, 'Košík nemôže byť prázdny'),
  shippingCost: z.number().min(0),
  customerEmail: z.string().email('Neplatný email'),
  customerName: z.string().min(1, 'Meno je povinné'),
  metadata: z.record(z.string()).optional(),
});

export type PaymentIntentData = z.infer<typeof paymentIntentSchema>;

// ===========================================
// HELPER: Extrahovať field errors z Zod result
// ===========================================

/**
 * Skonvertuje Zod chyby na objekt { fieldName: "chybová správa" }
 * Užitočné pre zobrazenie chýb vedľa formulárových polí.
 */
export function extractFieldErrors<T>(
  result: z.SafeParseReturnType<unknown, T>
): Record<string, string> {
  if (result.success) return {};
  
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}
