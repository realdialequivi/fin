# Spoken Demo Script — English (CEFR B2)

Target length: about 5 minutes. Read at a natural pace. `[pause]` means stop for one second.

---

## 1. Intro (~30 seconds)

Hello, and thank you for your time today. [pause]

I want to show you something we built for **Flexible Plan Investments**. FPI is a TAMP — a turnkey asset management program — and it has been serving independent advisors since 1981. [pause]

The demo has two parts. First, a landing page that explains FPI's solutions. Second, an **agent console** that shows how an Intercom Fin AI agent could work on top of FPI's systems. Let's begin.

---

## 2. Landing walkthrough — `/fpi/` (~90 seconds)

This is the public-facing page. At the top, you see the hero. The message is simple: defensive strategies, OnTarget monitoring, and a Fin AI assistant that queries the FPI platform in real time, twenty-four hours a day. [pause]

If I scroll down, you see the **strategies section**. These are real FPI product families: managed ETF portfolios, separately managed accounts, variable annuities, and self-directed brokerage accounts inside 401(k) plans. [pause]

Next is the **advisor book**. Think of this as the data Fin can reach — clients, accounts, OnTarget status, and recent activity. [pause]

Further down you have the **API schema** and a small **API explorer**. Every endpoint here is something Fin can call as a tool. So when Fin answers an advisor, it is not guessing; it is reading live data. [pause]

Now let's switch tabs and open the agent console.

---

## 3. Agent console — `/fpi/demo` (~120 seconds)

The console has three panels. On the **left** is the conversation. In the **middle** is the customer context — who Fin is helping. On the **right** is the **reasoning trace**: every tool call, every API response, every decision Fin makes. [pause]

Let's run **scenario one — Portfolio Review**. [pause]

The advisor asks: "Can you show me Maria's current positions?" Watch the right panel. Fin first calls `GET /clientes` by SSN to identify the client. Then it calls `GET /productos` for each account. In a few seconds, the middle panel fills with her portfolio, and Fin replies with a clean summary. [pause]

Notice two things. First, every number you see is grounded in a real API response. Second, the advisor never had to log into another system. [pause]

Now let's run **scenario two — OnTarget Alert**. [pause]

This time Fin starts proactively. An account has fallen below its OnTarget threshold. Fin calls `GET /ontarget`, identifies the deviation, and explains in plain English what changed and which strategies could bring the client back on plan. The advisor can act immediately, or ask a follow-up question. [pause]

If we had more time, scenarios three and four would show strategy recommendations and a real **rebalance request** — that one writes back to the platform with `POST /solicitudes/rebalance`.

---

## 4. Closing (~30 seconds)

So, what you just saw is a mock. But the pattern is real. [pause]

To deploy this on FPI's production systems, we would point Intercom Fin's **Custom Actions** at FPI's existing APIs, using the same tool definitions you saw in the trace panel. No data leaves FPI. The agent is grounded, auditable, and on-brand. [pause]

The next step is a one-hour technical session with your team to map these mock endpoints to your real ones. Thank you.
