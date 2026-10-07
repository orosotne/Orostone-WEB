import React, { useEffect } from 'react';
import { SEOHead, createBreadcrumbLD } from '../components/UI/SEOHead';
import { ActionButton, Container, Eyebrow, PageHero, Section, TextLink } from '../components/Design';

const MAPS_URL = 'https://www.google.com/maps?q=SNP+113%2F1%2C+956+18+Bo%C5%A1any';

const card = 'grid content-start justify-items-start gap-4 border-t border-brand-dark pt-7';
const cardTitle = 'text-[1.3rem] font-semibold leading-snug';
const contactLink = 'font-medium tabular-nums underline decoration-brand-line underline-offset-[5px] transition-colors hover:decoration-current';

export const EshopContact: React.FC = () => {
  // Prefetch legal-page chunks at idle — they are the typical next click from
  // /kontakt (footer Links) and otherwise trigger a chunk download on tap that
  // shows up as 700+ ms INP in Vercel Speed Insights.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void };
    const idle = (fn: () => void) =>
      w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200);
    idle(() => {
      void import('./VOP');
      void import('./PrivacyPolicy');
      void import('./ReklamacieAVratenie');
    });
  }, []);

  return (
    <div>
      <SEOHead
        title="Kontakt | OROSTONE — sinterovaný kameň"
        description="Cenová ponuka, vzorky alebo konzultácia k pracovnej doske zo sinterovaného kameňa. Showroom Bošany, dodanie po celom Slovensku."
        canonical="https://orostone.sk/kontakt"
        structuredData={createBreadcrumbLD([
          { name: 'OROSTONE', url: 'https://orostone.sk/' },
          { name: 'Kontakt', url: 'https://orostone.sk/kontakt' },
        ])}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://orostone.sk/kontakt#business",
          "name": "OROSTONE s.r.o.",
          "description": "Sinterovaný kameň pre kuchynské dosky, obklady a architektonické projekty.",
          "url": "https://orostone.sk",
          "telephone": "+421917588738",
          "email": "info@orostone.sk",
          "image": "https://orostone.sk/images/og-orostone.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Landererova 8",
            "addressLocality": "Bratislava",
            "addressRegion": "Bratislavský kraj",
            "postalCode": "811 09",
            "addressCountry": "SK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 48.1486,
            "longitude": 17.1077
          },
          "priceRange": "€€€",
          "currenciesAccepted": "EUR",
          "paymentAccepted": "Bankový prevod, Platba kartou, Apple Pay, Google Pay",
          "department": {
            "@type": "LocalBusiness",
            "name": "OROSTONE Showroom Bošany",
            "description": "Showroom sinterovaného kameňa v renesančnom kaštieli — porovnanie celých platní 3200 × 1600 mm pri dennom svetle. Cez víkend po dohode.",
            "telephone": "+421917588738",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "SNP 113/1",
              "addressLocality": "Bošany",
              "postalCode": "956 18",
              "addressCountry": "SK"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "17:00"
              }
            ]
          }
        }) }}
      />

      <PageHero
        eyebrow="Kontakt"
        title="Sme tu pre vás"
        lead="Pre cenovú ponuku alebo konzultáciu nás kontaktujte e-mailom alebo telefonicky. Odpovedáme čo najskôr."
        media={
          <dl className="m-0 grid gap-8 lg:justify-self-end">
            <div className="grid gap-1.5">
              <dt className="text-os-eyebrow uppercase text-brand-muted">Telefón</dt>
              <dd className="m-0 grid gap-1">
                <a href="tel:+421917588738" className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold tabular-nums tracking-[-0.01em] no-underline hover:underline">
                  +421 917 588 738
                </a>
                <span className="text-[0.92rem] font-normal text-brand-muted">Po–Pia 8:00 – 17:00</span>
              </dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-os-eyebrow uppercase text-brand-muted">E-mail</dt>
              <dd className="m-0 grid gap-1">
                <a href="mailto:dopyt@orostone.sk" className="text-[clamp(1.3rem,2vw,1.8rem)] font-semibold tracking-[-0.01em] no-underline hover:underline">
                  dopyt@orostone.sk
                </a>
                <span className="text-[0.92rem] font-normal text-brand-muted">Cenové ponuky a dopyty</span>
              </dd>
            </div>
          </dl>
        }
      />

      {/* Showroom = jediná adresa, kam majú klienti chodiť. Ide prvý a cez celú šírku,
          aby si ho nikto nepomýlil so sídlom v Bratislave. */}
      <Section tone="sand">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[clamp(48px,6vw,104px)]">
          <figure className="m-0">
            <img
              src="/images/home/showroom-kastiel.webp"
              alt="Renesančný kaštieľ v Bošanoch, showroom Orostone"
              width={1448}
              height={1086}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-[3px] object-cover"
            />
          </figure>
          <div className="grid justify-items-start gap-6">
            <Eyebrow>Tu nás nájdete</Eyebrow>
            <h2 className="text-os-h2">Showroom Bošany</h2>
            <div className="grid gap-1">
              <p className="text-[1.15rem] font-semibold">SNP 113/1, 956 18 Bošany</p>
              <p className="font-light text-brand-muted">Renesančný kaštieľ</p>
            </div>
            <dl className="m-0 grid w-full max-w-[460px] border-t border-brand-line">
              <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-brand-line py-3.5">
                <dt className="pt-0.5 text-os-eyebrow uppercase text-brand-muted">Otvorené</dt>
                <dd className="m-0 font-normal">Po–pia 9:00–17:00, cez víkend po dohode</dd>
              </div>
            </dl>
            <p className="max-w-[54ch] font-light text-brand-muted">
              Celé platne 3&nbsp;200&nbsp;×&nbsp;1&nbsp;600&nbsp;mm si tu pozriete pri dennom svetle a porovnáte dekory vo veľkej ploche. Na malej
              vzorke sa kresba ani mierka posúdiť nedajú.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ActionButton variant="dark" to="tel:+421917588738">
                Dohodnúť návštevu
              </ActionButton>
              <TextLink to={MAPS_URL}>Zobraziť na mape</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="chalk">
        <Container className="grid gap-x-[clamp(32px,5vw,80px)] gap-y-14 md:grid-cols-2">
          <article className={card}>
            <h2 className={cardTitle}>Sídlo a fakturačné údaje</h2>
            <p className="text-[0.92rem] font-normal text-brand-muted">Adresa pre faktúry a poštu, nie pre návštevu.</p>
            <p className="leading-relaxed">
              Orostone s.r.o.
              <br />
              Landererova 8, 811 09 Bratislava
              <br />
              mestská časť Staré Mesto
            </p>
            <p className="w-full max-w-[520px] border-l-2 border-brand-dark bg-brand-sand px-4 py-3 text-[0.92rem] font-normal">
              Na tejto adrese nie je showroom ani predajňa. Platne si pozriete v{' '}
              <strong className="font-semibold">Bošanoch, SNP 113/1</strong>.
            </p>
            <div className="grid gap-1 text-[0.9rem] font-normal text-brand-muted">
              <p>IČO: 55 254 772</p>
              <p>DIČ: 2121930580</p>
              <p>IČ DPH: SK2121930580</p>
              <p>Platiteľ DPH podľa §&nbsp;4 od 11.&nbsp;4.&nbsp;2023</p>
              <p>Zapísaná v Obchodnom registri Mestského súdu Bratislava III, oddiel Sro, vložka 167404/B</p>
            </div>
            <div className="grid gap-1 border-t border-brand-line pt-4">
              <p className="text-[0.9rem] font-normal text-brand-muted">Administratíva, faktúry a kancelária</p>
              <a href="mailto:info@orostone.sk" className={contactLink}>
                info@orostone.sk
              </a>
            </div>
          </article>

          <article className={card}>
            <h2 className={cardTitle}>Cenové ponuky a dopyty</h2>
            <p className="max-w-[54ch] font-light leading-relaxed text-brand-muted">
              Chcete cenovú ponuku alebo máte otázku k zákazke? Napíšte nám priamo na{' '}
              <strong className="font-semibold text-brand-dark">dopyt@orostone.sk</strong> — všetky cenové ponuky a dopyty
              zákazníkov vybavujeme práve tu.
            </p>
            <a href="mailto:dopyt@orostone.sk?subject=Žiadosť o cenovú ponuku" className={contactLink}>
              dopyt@orostone.sk
            </a>
          </article>

          <article className={card}>
            <h2 className={cardTitle}>Konzultácie</h2>
            <p className="max-w-[54ch] font-light leading-relaxed text-brand-muted">
              Máte otázky k výberu materiálu, realizácii alebo objednávke? Kontaktujte nás a člen nášho tímu sa vám v krátkom
              čase ozve s odborným odporúčaním.
            </p>
            <a href="tel:+421917588738" className={contactLink}>
              +421 917 588 738
            </a>
          </article>

          <article className={card}>
            <h2 className={cardTitle}>Kto odpovedá na vašu správu</h2>
            <div className="flex items-center gap-4">
              <img
                src="/images/marian-brazdil.png"
                alt="Marián Brázdil"
                width={64}
                height={64}
                loading="lazy"
                className="h-16 w-16 flex-none rounded-full object-cover object-top"
              />
              <div>
                <p className="font-semibold">Marián Brázdil</p>
                <p className="text-[0.92rem] font-normal text-brand-muted">Špecialista na sinterovaný kameň</p>
              </div>
            </div>
            <div className="grid gap-1.5">
              <a href="mailto:marian.brazdil@orostone.sk" className={contactLink}>
                marian.brazdil@orostone.sk
              </a>
              <a href="tel:+421911891875" className={contactLink}>
                0911 891 875
              </a>
            </div>
          </article>
        </Container>
      </Section>

      <Section tone="chalk" band={false} className="pb-[clamp(40px,5vw,72px)]">
        <Container className="grid gap-8">
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-y border-brand-line py-6">
            <div className="grid gap-1">
              <p className="font-semibold">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-gold align-middle" aria-hidden="true" />
                Hľadáme kolegov
              </p>
              <p className="text-[0.92rem] font-normal text-brand-muted">
                Kamenár, CNC špecialista, obkladač a PPC špecialista. Životopis posielajte na info@orostone.sk.
              </p>
            </div>
            <TextLink to="/kariera">Otvorené pozície</TextLink>
          </div>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-[0.84rem] font-normal text-brand-muted">
            <TextLink to="/vop" arrow={false}>
              Všeobecné obchodné podmienky
            </TextLink>
            <TextLink to="/ochrana-sukromia" arrow={false}>
              Ochrana osobných údajov
            </TextLink>
            <TextLink to="/reklamacie" arrow={false}>
              Reklamácie a vrátenie
            </TextLink>
          </p>
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="flex flex-wrap items-center justify-between gap-x-12 gap-y-7">
          <div className="grid gap-3">
            <h3 className="text-os-h2">Potrebujete rýchlu odpoveď?</h3>
            <p className="font-light text-brand-muted">Kontaktujte nás e-mailom alebo telefonicky.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ActionButton variant="dark" to="tel:+421917588738">
              Zavolať
            </ActionButton>
            <ActionButton variant="outline" to="mailto:dopyt@orostone.sk?subject=Dopyt z webu">
              Napísať e-mail
            </ActionButton>
          </div>
        </Container>
      </Section>
    </div>
  );
};
