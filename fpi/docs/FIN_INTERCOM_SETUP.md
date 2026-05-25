# Implementing Fin in Intercom — FPI

Step-by-step guide to deploy the Fin AI Agent inside Intercom, connected to the FPI demo API.

---

## 0. Prerequisites

- An Intercom workspace with **Fin AI Agent** enabled (Premium add-on).
- Admin access to the workspace.
- The FPI mock API live (e.g. `https://fin-production-f836.up.railway.app/fpi`).
- A list of advisor-facing content to ingest (FAQs, strategy one-pagers, ADV, CRS).

---

## 1. Enable Fin

1. Intercom → **Settings → AI → Fin**.
2. Toggle **Fin on** for the target audience (start with internal testers, then advisors).
3. Pick the channels: **Messenger**, **Email**, **WhatsApp**, **Slack-connect** (as needed).

---

## 2. Feed Fin with content (knowledge sources)

Fin answers from the sources you connect. Add at least:

| Source | How |
|---|---|
| Help Center articles | **Articles → New collection** ("Strategies", "OnTarget", "Onboarding") |
| PDFs (ADV, CRS, strategy sheets) | **AI → Content → Upload PDFs** |
| Websites | **AI → Content → External sites** (point at flexibleplan.com sub-pages) |
| Snippets (short Q/A) | **AI → Content → Snippets** for tone-controlled answers |

After upload, click **Train Fin** and wait for the indexing badge to turn green.

---

## 3. Configure persona and tone

Settings → **AI → Fin → Persona**:

- **Name:** Fin (or "FPI Advisor Assistant")
- **Tone:** Professional, concise, factual. Avoid speculation about returns.
- **Guardrails (System instructions):**
  - "Never give personalized investment advice. Refer to the licensed advisor."
  - "Quote OnTarget status only from the API, never invent numbers."
  - "Cite the source article when answering compliance questions."

---

## 4. Connect the FPI API as Custom Actions

This is what lets Fin call our endpoints to fetch live client / portfolio data.

Settings → **AI → Custom Actions → New action**.

### Example action 1 — Look up client

| Field | Value |
|---|---|
| Name | `get_client_by_ssn` |
| Description | Returns client profile, AUM, OnTarget status, and portfolios. |
| Method | `GET` |
| URL | `https://fin-production-f836.up.railway.app/fpi/clientes/{ssn}` |
| Input | `ssn` (string, required) — "Client SSN, 9 digits, dashes optional" |
| Auth | None (demo). For production: Bearer token in header. |

### Example action 2 — Check OnTarget status

| Field | Value |
|---|---|
| Name | `check_ontarget` |
| Method | `GET` |
| URL | `https://fin-production-f836.up.railway.app/fpi/ontarget?client={ssn}` |

### Example action 3 — Submit rebalance request

| Field | Value |
|---|---|
| Name | `submit_rebalance` |
| Method | `POST` |
| URL | `https://fin-production-f836.up.railway.app/fpi/solicitudes/rebalance` |
| Body schema | `{ "client_ssn": "string", "portfolio_id": "string", "reason": "string" }` |

Repeat for `/strategies`, `/estadisticas`, and any other endpoint Fin should reach. Full endpoint list in `API_SETUP.md`.

---

## 5. Build workflows (handover & escalation)

Settings → **Workflows → New workflow** for Fin.

Typical flows:

1. **Greeting** → Detect intent (`portfolio review`, `compliance question`, `rebalance request`).
2. **Resolve with Fin** → Fin answers using content + Custom Actions.
3. **Escalate** rules:
   - Topic contains "complaint" / "PQR" → route to Compliance team.
   - Confidence below threshold → handover to a human advisor.
   - Outside business hours → collect details, create a ticket.

---

## 6. Test in Preview mode

- **AI → Fin → Preview**: send test prompts.
- Confirm Custom Actions return data (check the trace panel).
- Edge cases: invalid SSN, client not found, large portfolio, after-hours.

Suggested test prompts:

- "What is the OnTarget status of client 123-45-6789?"
- "Recommend strategies for a moderate-risk $500K IRA."
- "Submit a rebalance request for portfolio P-0142."
- "What is the ADV Part 2A filing?"

---

## 7. Roll out

1. Start with **internal team only** (1–2 weeks).
2. Expand to **pilot advisors** (5–10).
3. Full launch — update Messenger placement on the advisor portal.

---

## 8. Monitor

- **Reports → AI Insights**: resolution rate, CSAT, handover rate.
- **Conversations → Filter "AI Agent involved"**: audit answers weekly.
- **Content gaps**: Fin flags questions it could not answer — add articles for the top 10 each week.

---

## 9. Production hardening (before real client data)

- Replace mock API with FPI's real systems (or a secured proxy).
- Add **Bearer token auth** to all Custom Actions.
- Whitelist Intercom egress IPs in the API firewall.
- Enable **conversation data retention** per FPI compliance policy.
- Run a **SOC 2 / SEC review** of the integration.

---

## Quick reference

| Step | Owner | ETA |
|---|---|---|
| Enable Fin + content upload | Intercom admin | 1 day |
| Custom Actions wired to API | Engineering | 2 days |
| Workflows + handover rules | CX lead | 1 day |
| Internal test + tuning | CX + Eng | 1 week |
| Pilot rollout | CX | 1 week |
| Full launch | All | — |

Total: ~2–3 weeks from kickoff to live.
