# Landing comparison — flexibleplan.com vs. FPI Fin demo

A side-by-side view of FPI's current public landing and the proposed Fin demo landing.

---

## Overview

| Aspect | flexibleplan.com (current) | FPI Fin demo (proposed) |
|---|---|---|
| **Purpose** | Marketing site for advisors | Interactive AI agent demo for advisors |
| **Audience** | Prospective RIAs, advisors | Same — but showing Fin in action |
| **Primary CTA** | "Contact Sales" / "Learn More" | "Open the Fin console" / "Try a scenario" |
| **Tone** | Conservative, institutional | Modern, product-led, premium fintech |
| **Tech stack** | DotNetNuke (legacy CMS) | Static HTML + Express API |

---

## Visual design

| Element | flexibleplan.com | FPI Fin demo |
|---|---|---|
| Theme | Light (white / cream) | Dark (deep navy / near-black) |
| Primary color | Jade green `#0B6E3B` family | Same jade green (matched palette) |
| Typography | Roboto Slab + system sans | Instrument Serif (display) + Inter |
| Imagery | Stock photos (waterfalls, kayaks) | Abstract gradients, glow blobs, grid pattern |
| Layout density | Traditional sections, narrow text | Wide grid, cards, live preview panels |
| Motion | Static | Animated blobs, gradient shifts, message typing |

**Why dark for the demo?** A dark, premium aesthetic signals "AI product", not "corporate site". The jade-green accent ties it back to FPI brand.

---

## Content structure

| Section | flexibleplan.com | FPI Fin demo |
|---|---|---|
| Hero | "Differentiate your business…" + screenshots | "Dynamic risk management, built for advisors" + live Fin chat preview |
| Stats | Implicit, in body copy | Explicit strip: `$2B+ AUM · 40+ years · ~90 specialists · OnTarget Investing` |
| Solutions | 9 cards (FlexDirex, Model manager, Turnkey, SDBA, ETF strategist, VA, FundLink, DAF, Principled) | 12 cards — same lineup + Evolution methodology, Strategic Solutions, ESG, 401(k) SMAs |
| Platform integrations | Logo grid (Schwab, Axos, Nationwide, Envestnet, …) | Not included (out of scope for demo) |
| Advisor book | Not shown | 30-client demo table with filters + OnTarget status |
| Data model | Not shown | Schema cards (advisors, clients, portfolios, strategies, allocations, performance, transactions) |
| API docs | Not shown | Live endpoint reference with "Try it" buttons |
| Fin chat | Not shown | Animated preview + full /fpi/demo console |
| News / "In My Opinion" | Prominent on home | Out of scope for demo |
| White paper download | Featured ("Gold in portfolios") | Out of scope |
| Footer | Address, ADV/CRS, disclosures | Same address + demo disclaimer |

---

## What the demo adds (beyond the current site)

1. **OnTarget status visible per client** — the public site mentions OnTarget; the demo shows it in action.
2. **Fin AI assistant** — advisors can ask plain-language questions, Fin pulls from the API and answers.
3. **Live API surface** — proves the data model and integration story.
4. **Scenario walkthroughs** — `/fpi/demo` has 4 ready-to-run scenarios (Portfolio Review, OnTarget Alert, Strategy Recommendation, Rebalance Request).

---

## What the demo leaves out (intentionally)

- News feed and "In My Opinion" articles
- White paper downloads
- Login / RIA portal
- Multi-language and translator widgets
- Platform integration logos (would be added in a real implementation)

---

## Brand alignment

The demo's color palette was tuned to FPI's jade green:

| Use | Hex |
|---|---|
| Primary green (bright) | `#1FA85C` |
| Primary green (dark) | `#0B6E3B` |
| Secondary teal | `#0F766E` |
| Highlight lime | `#A3E635` |
| Background base | `#07090F` |

This keeps FPI's brand recognition while signaling "next-generation product".

---

## Recommendation

Use the demo as a **sales artifact** (showed live in advisor pitches), not as a replacement for the public site. Once validated with prospects, the most impactful sections (OnTarget visualization, Fin chat) can be ported into flexibleplan.com itself or into the advisor portal.
