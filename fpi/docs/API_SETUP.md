# API Setup & Deployment

## 1. Prerequisites

- **Node.js ≥ 18** (we recommend the latest LTS)
- **git**
- An npm-compatible package manager (`npm`, `pnpm` or `yarn`)

## 2. Clone & install

```bash
git clone https://github.com/<org>/fin.git
cd fin
npm install
```

## 3. Run locally

```bash
npm start
# server listening on http://localhost:3000
```

Open:

- Landing: <http://localhost:3000/fpi/>
- Demo console: <http://localhost:3000/fpi/demo>
- API root (JSON catalog): <http://localhost:3000/fpi/api>

## 4. Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | TCP port the Express server binds to. Railway sets this automatically. |

## 5. Endpoint reference

All routes are mounted under the `/fpi` prefix.

| Method | Path | Returns |
|---|---|---|
| GET | `/fpi/` | Landing page (HTML). |
| GET | `/fpi/demo` | Agent console (HTML). |
| GET | `/fpi/api` | JSON catalog of available endpoints. |
| GET | `/fpi/clientes` | List of all demo clients. |
| GET | `/fpi/clientes/:ssn` | Single client lookup by SSN. |
| GET | `/fpi/productos/:numero` | Single account/product lookup by account number. |
| GET | `/fpi/strategies` | FPI strategy catalog (ETF, SMA, VA, SDBA, etc.). |
| GET | `/fpi/ontarget` | OnTarget monitoring snapshot across the book. |
| GET | `/fpi/estadisticas` | Aggregate stats (AUM, client count, OnTarget %). |
| POST | `/fpi/solicitudes/portfolio` | Create a portfolio review request. |
| POST | `/fpi/solicitudes/rebalance` | Create a rebalance request for an account. |
| POST | `/fpi/pqr` | Create a customer service ticket (PQR). |

## 6. How it's hosted

The repo runs a single Express app from `/index.js`. The FPI mini-app is a self-contained Express router mounted as a sub-app:

```js
// /index.js
app.use('/fpi', require('./fpi/index.js'));
```

This means everything inside `fpi/index.js` is namespaced under `/fpi` automatically — its internal route `/clientes/:ssn` is reachable from the outside as `/fpi/clientes/:ssn`. Other product demos can be mounted the same way without conflicts.

Hosting platform: **Railway**. The root `package.json` start script runs `node index.js`. Railway provides `PORT` and a public HTTPS domain.

## 7. Deploy

```bash
git push origin main
```

Railway detects the push, builds the Node app, and rolls out a new instance. Logs are visible in the Railway dashboard. No additional CI is required for the demo.

## 8. Pointing Intercom Fin Custom Actions at this API

In Intercom, create a **Custom Action** per endpoint. Use:

- **Base URL**: `https://<your-railway-domain>/fpi`
- **Auth**: none for the public demo. For production, put an API key in `Authorization: Bearer …` and verify it in an Express middleware.

### Example tool definition: `get_client_by_ssn`

```json
{
  "name": "get_client_by_ssn",
  "description": "Look up an FPI client by US Social Security Number. Returns name, accounts, and OnTarget status.",
  "method": "GET",
  "url": "https://<your-railway-domain>/fpi/clientes/{ssn}",
  "parameters": {
    "ssn": {
      "type": "string",
      "description": "9-digit US SSN, no dashes",
      "required": true
    }
  }
}
```

Repeat for each endpoint in section 5. Write actions (`POST /solicitudes/*`, `POST /pqr`) should be flagged as **side-effecting** in Intercom so Fin asks for advisor confirmation before calling them.
