# FPI Fin Demo — Manual

## What this is
An interactive demonstration of an **Intercom Fin** AI agent tailored for **Flexible Plan Investments (FPI)**, a TAMP (Turnkey Asset Management Program) serving independent financial advisors. The demo shows how Fin can query FPI's platform in real time to answer advisor questions, surface OnTarget alerts, and trigger back-office workflows.

## The two URLs

| Path | Purpose |
|---|---|
| `/fpi/` | Marketing-style landing page covering FPI's solutions, strategies, advisor book and a live API explorer. |
| `/fpi/demo` | 3-panel **Agent Console**: chat on the left, customer context in the middle, Fin's reasoning trace (tool calls + responses) on the right. |

## Demo scenarios (in `/fpi/demo`)
Click any of the four buttons in the header to auto-play a conversation:

1. **Portfolio Review** — Advisor asks for a client's positions; Fin pulls `/clientes/:ssn` and `/productos/:numero`.
2. **OnTarget Alert** — A managed account is below target; Fin explains the deviation and proposes next steps.
3. **Strategy Recommendation** — Advisor wants a suitable FPI strategy for a retired client; Fin queries `/strategies` and filters.
4. **Rebalance Request** — Advisor instructs Fin to rebalance an SMA; Fin posts to `/solicitudes/rebalance` and confirms.

## Mock API behind it
All data is served by the Express app in `fpi/index.js`:

`GET /api`, `GET /clientes`, `GET /clientes/:ssn`, `GET /productos/:numero`, `GET /strategies`, `GET /ontarget`, `GET /estadisticas`, `POST /solicitudes/portfolio`, `POST /solicitudes/rebalance`, `POST /pqr`.

## Audience and usage
The demo is intended for **FPI sales / evaluation calls**. In a meeting:

- Open `/fpi/` to frame who FPI is and what API surface Fin would call.
- Switch to `/fpi/demo`, run scenarios 1 and 2 to show grounded answers.
- Use scenario 4 to show write actions (workflow automation, not just Q&A).
- Close by mapping each tool call to a real FPI system the prospect already operates.
