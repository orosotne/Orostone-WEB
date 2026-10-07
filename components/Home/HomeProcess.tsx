import React, { Suspense } from 'react';
import { Container, Eyebrow, Section, SectionHeader, TextLink } from '../Design';
import { lazyWithRetry } from '../../lib/utils';
import { ORO_KLIENT } from './homeData';

// The free-sample lead form (Turnstile, Supabase, Meta Lead + GA4 generate_lead) loads in its own chunk
const SampleLeadForm = lazyWithRetry(() => import('../Shop/SampleLeadForm').then((m) => ({ default: m.SampleLeadForm })));

const STEPS = [
  {
    img: '1-orientacna-cena',
    alt: 'Pôdorys kuchyne a vzorky dekorov Calacatta Top, Roman Travertine a Nero Margiua na dubovom stole, pohľad zhora',
    title: 'Orientačná cena',
    text: 'Štyri krátke otázky: čo riešite, aký dekor sa vám páči, kedy plánujete a kam vám cenu poslať. Odpovieme spravidla nasledujúci pracovný deň.',
  },
  {
    img: '2-zameranie',
    alt: 'Ruka meria zvinovacím metrom hornú hranu dubových skriniek',
    title: 'Bezplatné zameranie',
    text: 'Zameranie u vás doma, nezáväzne a bez poplatku. Potom dostanete presnú ponuku, položku po položke.',
  },
  {
    img: '3-vyroba-a-montaz',
    alt: 'Ruky v pracovných rukaviciach osádzajú pracovnú dosku Calacatta Top na dubové skrinky',
    title: 'Výroba a montáž',
    text: 'Materiál dodá Orostone. Dosku vyrobia a osadia skúsení kamenári, s ktorými dlhodobo spolupracujeme.',
  },
] as const;

/** How it works (three steps, same as on oro-klient) and the personal advice from Marián. */
export const HomeProcess: React.FC = () => (
  <Section tone="chalk" id="postup">
    <Container>
      <SectionHeader eyebrow="Ako to funguje" title="Od otázky po hotovú kuchyňu." />
      <ol className="hp-steps">
        {STEPS.map((s, i) => (
          <li key={s.img}>
            <img src={`/images/home/postup/${s.img}.webp`} alt={s.alt} width={1000} height={749} loading="lazy" decoding="async" />
            <b className="hp-step-n">{i + 1}</b>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="hp-steps-note">Ilustračné zábery. Kameň na nich je skutočný dekor Orostone.</p>

      <div className="hp-advice" id="poradime">
        <figure className="m-0">
          <img src="/images/home/marian-vzorky.webp" alt="Marián Brázdil drží vzorku sinterovaného kameňa nad otvorenou vzorkovnicou" width={760} height={821} loading="lazy" decoding="async" />
        </figure>
        <div className="hp-advice-txt">
          <Eyebrow>Osobná rada</Eyebrow>
          <h3 className="text-os-h2">Neviete sa rozhodnúť?</h3>
          <p className="max-w-[54ch] text-os-lead font-light text-brand-muted">
            Marián Brázdil vám poradí s dekorom aj s tým, koľko materiálu bude vaša kuchyňa potrebovať. Vzorku vám pošleme domov zadarmo, stačí vyplniť formulár.
          </p>
          <p className="hp-person">
            <b>Marián Brázdil</b>
            <span>
              Špecialista na sinterovaný kameň · <a href="tel:+421911891875">0911 891 875</a>
            </span>
          </p>
          {/* id="vzorka": older links to /#vzorka land on the form */}
          <div id="vzorka" className="w-full scroll-mt-16 lg:scroll-mt-20">
            <Suspense fallback={<div className="min-h-[520px]" aria-hidden="true" />}>
              <SampleLeadForm />
            </Suspense>
          </div>
          <TextLink to={ORO_KLIENT('porada')}>Radšej rovno orientačnú cenu</TextLink>
        </div>
      </div>
    </Container>
  </Section>
);
