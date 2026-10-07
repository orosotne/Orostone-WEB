import React from 'react';
import {
  ActionButton,
  Container,
  Eyebrow,
  Section,
  SectionHeader,
  TextLink,
  useDrawIn,
  IconCastle,
  IconSlabs,
  IconPriceClock,
  IconFabrication,
  IconWarranty,
  IconDispatch,
  IconDelivery,
  IconSecurePay,
} from '../components/Design';

const ICONS = [IconCastle, IconSlabs, IconPriceClock, IconFabrication, IconWarranty, IconDispatch, IconDelivery, IconSecurePay];

const IconRow: React.FC<{ onDark?: boolean }> = ({ onDark = false }) => {
  const draw = useDrawIn<HTMLDivElement>();
  return (
    <div ref={draw.ref} className={`flex flex-wrap gap-8 ${onDark ? 'os-on-dark' : ''} ${draw.className}`}>
      {ICONS.map((Icon, i) => (
        <div key={i} className="os-ico-item grid justify-items-center" style={{ '--d': `${i * 0.12}s` } as React.CSSProperties}>
          <Icon className="h-12 w-12" />
        </div>
      ))}
    </div>
  );
};

const SWATCHES: Array<[name: string, cls: string, hex: string]> = [
  ['brand.dark', 'bg-brand-dark', '#1A1A1A'],
  ['brand.light', 'bg-brand-light', '#F9F9F7'],
  ['brand.gray', 'bg-brand-gray', '#F5F5F0'],
  ['brand.sand', 'bg-brand-sand', '#EFEDE6'],
  ['brand.muted', 'bg-brand-muted', '#5F5E5A'],
  ['brand.line', 'bg-brand-line', '#E2E0D8'],
  ['brand.gold', 'bg-brand-gold', '#ECD488'],
];

/** Dev-only reference sheet of the new design system (route /_dizajn, never in production builds). */
export const DesignPreview: React.FC = () => (
  <div className="font-sans">
    <Section tone="chalk">
      <Container className="grid gap-10">
        <SectionHeader
          as="h1"
          eyebrow="Dizajnový systém"
          title="Sinterovaný kameň pre kuchyne, kde nechcete robiť kompromis."
          lead="Referenčný hárok nových prvkov. Táto stránka existuje len pri vývoji."
        />
        <div className="flex flex-wrap gap-4">
          {SWATCHES.map(([name, cls, hex]) => (
            <div key={name} className="grid gap-2 text-sm">
              <span className={`h-16 w-28 rounded-[10px] border border-brand-line ${cls}`} />
              <span className="font-medium">{name}</span>
              <span className="text-brand-muted">{hex}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-3">
          <p className="text-os-h1">Nadpis H1 · text-os-h1</p>
          <p className="text-os-h2">Nadpis H2 · text-os-h2</p>
          <p className="text-os-h3">Nadpis H3 · text-os-h3</p>
          <p className="text-os-lead font-light text-brand-muted">Úvodný text · text-os-lead</p>
          <Eyebrow>Eyebrow · text-os-eyebrow</Eyebrow>
        </div>
        <IconRow />
        <div className="flex flex-wrap items-center gap-6">
          <ActionButton variant="gold" to="https://oro-klient.orostone.sk/?od=dizajn">Orientačná cena</ActionButton>
          <ActionButton variant="dark" to="/vzorky">Objednať vzorku zadarmo</ActionButton>
          <ActionButton variant="outline" size="sm">Menšie tlačidlo</ActionButton>
          <TextLink to="/realizacie">Všetky realizácie</TextLink>
        </div>
      </Container>
    </Section>
    <Section tone="sand">
      <Container>
        <SectionHeader
          eyebrow="Svetlá sekcia"
          title="Striedanie krieda a piesok."
          lead="Svetlé sekcie sa striedajú, aby bolo vidno, kde sekcia končí."
        />
      </Container>
    </Section>
    <Section tone="graphite">
      <Container className="grid gap-8">
        <SectionHeader
          onDark
          eyebrow="Tmavá sekcia"
          title="Kameň, ktorý netreba impregnovať."
          lead="Na tmavej sekcii je eyebrow zlatý a úvodný text svetlejší."
        />
        <IconRow onDark />
        <div className="flex flex-wrap items-center gap-6">
          <ActionButton variant="light-outline">Svetlý obrys</ActionButton>
          <TextLink to="/sinterovany-kamen">Viac o materiáli</TextLink>
        </div>
      </Container>
    </Section>
    <Section tone="gold">
      <Container className="flex flex-wrap items-center justify-between gap-6">
        <p className="text-os-h2">Koľko bude stáť vaša doska?</p>
        <ActionButton variant="dark" to="https://oro-klient.orostone.sk/?od=dizajn" arrow>
          Získať orientačnú cenu
        </ActionButton>
      </Container>
    </Section>
  </div>
);
