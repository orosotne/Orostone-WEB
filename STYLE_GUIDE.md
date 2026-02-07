# Orostone Typography & Style Guide

This document defines the typography system and styling rules for the Orostone website. All pages must follow these guidelines to ensure visual consistency.

---

## Typography System

### Font Family

| Font | Tailwind Class | Usage |
|------|---------------|-------|
| **Montserrat** | `font-sans` | All text (headings, body, labels) |

> Note: `font-serif` is also mapped to Montserrat in `tailwind.config.js` for backwards compatibility.

---

## Heading Sizes

### Hero H1 (Primary)
```
text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1]
```
**Usage:** Main hero heading on each page (e.g., "Krása kameňa.")

### Hero H1 (Accent/Secondary)
```
text-5xl md:text-6xl lg:text-7xl font-sans font-light italic
```
**Usage:** Secondary hero text, typically in `text-brand-gold` (e.g., "Sila technológie.")

### Section H2
```
text-3xl md:text-4xl lg:text-5xl font-sans font-bold
```
**Usage:** All section headings throughout the page

### Card H3
```
text-xl md:text-2xl font-sans font-bold
```
**Usage:** Card titles, feature titles, benefit titles

### Subsection H4
```
text-lg md:text-xl font-sans font-bold
```
**Usage:** Smaller subsection headings

---

## Body Text

### Body Large (Subtitles)
```
text-lg font-sans font-light leading-relaxed
```
**Usage:** Section subtitles, important descriptions

### Body Normal (Standard)
```
text-base font-sans font-light leading-relaxed
```
**Usage:** Card descriptions, general text content

### Body Small
```
text-sm font-sans font-light
```
**Usage:** Less important text, footnotes

---

## Labels & Tags

### Section Label
```
text-xs font-sans font-bold text-brand-gold tracking-widest uppercase mb-4 block
```
**Usage:** Labels above section headings (e.g., "Prečo Orostone", "Kolekcie")

### Card Label
```
text-xs font-sans tracking-widest uppercase
```
**Usage:** Small labels on cards

---

## Special Elements

### Quotes/Testimonials
```
text-xl md:text-2xl lg:text-3xl font-sans font-light italic leading-relaxed
```
**Usage:** Customer testimonials, featured quotes

### FAQ Questions
```
text-xl font-sans font-semibold
```
**Usage:** FAQ accordion questions

### FAQ Answers
```
text-lg font-sans font-light leading-relaxed
```
**Usage:** FAQ accordion answers

---

## Buttons

### Primary Button
```
text-sm font-sans
```
**Usage:** All button text

---

## Colors

### Brand Colors

| Color | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| **Gold** | `text-brand-gold` | #ECD488 | Accents, labels, highlights, CTA |
| **Dark** | `text-brand-dark` | #1A1A1A | Primary text on light backgrounds |
| **Light** | `text-brand-light` | #F9F9F7 | Backgrounds |
| **White** | `text-white` | #FFFFFF | Text on dark backgrounds |

### Gray Scale (for secondary text)

| Shade | Tailwind Class | Usage |
|-------|---------------|-------|
| Light | `text-gray-400` | Subtle text on dark backgrounds |
| Medium | `text-gray-500` | Secondary text on light backgrounds |
| Dark | `text-gray-600` | Emphasized secondary text |

---

## Spacing Guidelines

### Section Padding
```
py-32
```
**Usage:** Standard vertical padding for sections

### Container
```
container mx-auto px-6
```
**Usage:** Standard container with horizontal padding

### Section Header Margin
```
mb-20
```
**Usage:** Margin below section headers before content

---

## Component Patterns

### Section Header Pattern
```tsx
<div className="text-center mb-20">
  <span className="font-sans text-xs font-bold text-brand-gold tracking-widest uppercase mb-4 block">
    Label Text
  </span>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6">
    Section Heading
  </h2>
  <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
    Section description text goes here.
  </p>
</div>
```

### Hero Section Pattern
```tsx
<section className="relative h-screen min-h-[800px] w-full flex items-center justify-center">
  {/* Background */}
  <div className="absolute inset-0 z-0">
    {/* Image + Overlays */}
  </div>
  
  {/* Content */}
  <div className="container mx-auto px-6 relative z-10 text-center text-white">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-normal leading-[1]">
      Main Heading
    </h1>
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-light italic text-brand-gold">
      Accent Heading
    </h1>
    <p className="text-lg font-sans font-light text-gray-300 max-w-2xl mx-auto mt-8">
      Subtitle description
    </p>
  </div>
</section>
```

### Card Pattern
```tsx
<div className="p-8 bg-[#F9F9F7] rounded-3xl">
  <h3 className="text-xl md:text-2xl font-sans font-bold text-brand-dark mb-2">
    Card Title
  </h3>
  <p className="text-gray-500 text-base font-light">
    Card description text
  </p>
</div>
```

---

## Quick Reference Table

| Element | Size | Weight | Extra |
|---------|------|--------|-------|
| Hero H1 | `text-5xl md:text-6xl lg:text-7xl` | `font-bold` | `leading-[1]` |
| Hero H1 accent | `text-5xl md:text-6xl lg:text-7xl` | `font-light` | `italic` |
| Section H2 | `text-3xl md:text-4xl lg:text-5xl` | `font-bold` | - |
| Card H3 | `text-xl md:text-2xl` | `font-bold` | - |
| Body Large | `text-lg` | `font-light` | `leading-relaxed` |
| Body Normal | `text-base` | `font-light` | `leading-relaxed` |
| Labels | `text-xs` | `font-bold` | `tracking-widest uppercase` |
| Quote | `text-xl md:text-2xl lg:text-3xl` | `font-light` | `italic` |
| Button | `text-sm` | default | - |

---

## Do's and Don'ts

### ✅ DO
- Use `font-sans` for all text
- Use `font-bold` for headings
- Use `font-light` for body text
- Use consistent responsive sizing (sm → md → lg)
- Keep labels uppercase with wide tracking

### ❌ DON'T
- Don't use `font-serif` (it's deprecated)
- Don't mix different heading sizes in the same context
- Don't use arbitrary font sizes like `text-[10px]`
- Don't forget responsive breakpoints for headings
- Don't use `font-medium` or `font-normal` for headings (use `font-bold`)

---

*Last updated: February 2026*
