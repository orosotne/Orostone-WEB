import React from 'react';
import { SEOHead } from '@/components/UI/SEOHead';
import {
  ActionButton,
  Container,
  FaqList,
  GoldBand,
  LegalClause,
  LegalLayout,
  LegalSection,
  PageHero,
  Section,
  SectionHeader,
  StepList,
  TextLink,
  oroKlientUrl,
} from '@/components/Design';
import {
  ODPORUCTE_DESCRIPTION,
  ODPORUCTE_FAQ,
  ODPORUCTE_H1,
  ODPORUCTE_LEAD,
  ODPORUCTE_RULES,
  ODPORUCTE_STEPS,
  ODPORUCTE_TITLE,
  REFERRAL_FRIEND_EUR,
  REFERRAL_VALID_UNTIL,
} from '@/data/odporucte';

/*
 * Odporúčací program „Odporučte Orostone“: pravidlá pre zákazníkov a ich známych.
 * Texty a sumy sú v data/odporucte.ts (spoločné s prerenderom).
 */

const TOC = ODPORUCTE_RULES.map((rule) => ({ id: rule.id, label: `${rule.number}. ${rule.title}` }));

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Orostone', item: 'https://orostone.sk/' },
        { '@type': 'ListItem', position: 2, name: ODPORUCTE_H1, item: 'https://orostone.sk/odporucte' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: ODPORUCTE_FAQ.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ],
};

export const Odporucte: React.FC = () => (
  <div>
    <SEOHead
      title={ODPORUCTE_TITLE}
      description={ODPORUCTE_DESCRIPTION}
      canonical="https://orostone.sk/odporucte"
      structuredData={structuredData}
    />

    <PageHero
      breadcrumb={[{ label: 'Orostone', to: '/' }, { label: ODPORUCTE_H1 }]}
      title={ODPORUCTE_H1}
      lead={ODPORUCTE_LEAD}
      actions={
        <>
          <ActionButton variant="dark" to={oroKlientUrl('odporucte')} arrow>
            Získať orientačnú cenu
          </ActionButton>
          <TextLink to="#podmienky">Prečítať podmienky</TextLink>
        </>
      }
    />

    {/* ─── AKO TO FUNGUJE ─── */}
    <Section tone="sand" id="ako-to-funguje">
      <Container>
        <SectionHeader eyebrow="Ako to funguje" title="Od kódu po odmenu" />
        <StepList steps={ODPORUCTE_STEPS} className="mt-[clamp(32px,4vw,48px)]" />
      </Container>
    </Section>

    {/* ─── PODMIENKY ─── */}
    <div id="podmienky" className="scroll-mt-28">
      <LegalLayout
        tocTitle="Podmienky programu"
        toc={TOC}
        intro={
          <p className="font-light leading-[1.75] text-brand-dark/85">
            Program prevádzkuje Orostone s.r.o. a platí do {REFERRAL_VALID_UNTIL}.
          </p>
        }
      >
        {ODPORUCTE_RULES.map((rule) => (
          <LegalSection key={rule.id} id={rule.id} number={rule.number} title={rule.title}>
            {rule.clauses.map((clause, i) => (
              <LegalClause key={i} number={`${rule.number}.${i + 1}`}>
                {clause}
              </LegalClause>
            ))}
          </LegalSection>
        ))}
      </LegalLayout>
    </div>

    {/* ─── OTÁZKY ─── */}
    <Section tone="chalk" id="otazky">
      <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[clamp(48px,6vw,104px)]">
        <SectionHeader eyebrow="Otázky" title="Čo sa zákazníci pýtajú" />
        <FaqList items={ODPORUCTE_FAQ} />
      </Container>
    </Section>

    <GoldBand
      od="odporucte"
      title="Odporučil vám nás známy?"
      text={`Štyri krátke otázky, kód od známeho zadáte na konci. Odpočet ${REFERRAL_FRIEND_EUR} € z ceny materiálu uvidíte v cenovej ponuke.`}
    />
  </div>
);
