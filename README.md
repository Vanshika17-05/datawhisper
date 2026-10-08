# Datawhisper

Chat with your database in plain English and turn answers into useful visualizations.

## Tech stack

- React, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion
- Express, MongoDB with Mongoose, Zod
- Google Gemini for query generation and semantic retrieval

## Setup

1. Copy `server/.env.example` to `server/.env` and fill in the required values.
2. Copy `client/.env.example` to `client/.env` if you need to override the API URL.
3. Run `npm run install:all` from this directory.
4. Run `npm run dev`.
5. Open http://localhost:5173. The API runs at http://localhost:5000.

## Environment variables

| Variable | Location | Required | Purpose |
| --- | --- | --- | --- |
| `PORT` | `server/.env` | No | API port; defaults to `5000` |
| `MONGODB_URI` | `server/.env` | Yes | MongoDB connection string |
| `DATABASE_URL` | `server/.env` | Yes | Neon PostgreSQL connection string used by Prisma analytics |
| `GEMINI_API_KEY` | `server/.env` | Yes | Google Gemini API key |
| `AWS_REGION` | `server/.env` | Yes | AWS region containing the exports bucket |
| `AWS_S3_BUCKET_NAME` | `server/.env` | Yes | Private AWS S3 bucket used for generated PNG and CSV exports |
| `JWT_SECRET` | `server/.env` | Yes | Secret of at least 32 characters used to sign login sessions |
| `GEMINI_MODEL` | `server/.env` | No | Gemini model; defaults to `gemini-3.8-flash` |
| `GEMINI_EMBEDDING_MODEL` | `server/.env` | No | Embedding model; defaults to `gemini-embedding-001` |
| `CLIENT_URL` | `server/.env` | No | Comma-separated allowed CORS origins |
| `NODE_ENV` | `server/.env` | No | Runtime environment |
| `VITE_API_URL` | `client/.env` | No | Browser-facing API base URL |

## Running with Docker

1. Copy `server/.env.example` to `server/.env` and add the Atlas, Neon, Gemini, and JWT values. Atlas and Neon remain managed external services; Compose does not run local database containers.
2. Optionally copy `client/.env.example` to `client/.env`. The Docker build uses `/api`, which nginx proxies internally to the `server` service.
3. Apply the PostgreSQL migration once with `cd server && npm run prisma:migrate`, or run it against the same `DATABASE_URL` from your deployment workflow.
4. From the repository root, run `docker compose up --build`.
5. Open http://localhost:8080. The API is also exposed directly at http://localhost:5000/api/health.

Secrets are supplied at container runtime through `server/.env`; `.env` files are excluded from both Docker build contexts and Git.

## Production deployment

The repository includes `render.yaml` for the Express API and `client/vercel.json` for the Vite single-page app. On Render, deploy the repository as a Blueprint (or create a Web Service with root directory `server`, build command `npm ci --include=dev && npm run prisma:generate && npm run build`, and start command `node dist/server.js`). Build-time TypeScript tooling lives in `devDependencies`, so it is explicitly included even when `NODE_ENV=production`. Apply `npm run prisma:migrate` separately against the production `DATABASE_URL` before the first deploy; Render's free plan does not support a pre-deploy command, and a sleeping external Postgres instance must not block application builds. On Vercel, import the same repository with `client` as the root directory and set `VITE_API_URL` to `https://<render-service>/api`.

- Production frontend: https://datawhisper-three.vercel.app
- Production API: https://datawhisper-api-live.onrender.com
- API health check: https://datawhisper-api-live.onrender.com/api/health

Set Render's `CLIENT_URL` to the exact Vercel production origin. Production CORS reads only this allowlist; localhost and wildcards are not automatically allowed. Render generates the production `JWT_SECRET`, while all remaining secrets must be entered in the platform environment settings and never committed.

Render's free web services spin down when idle. The first API request after an idle period can take roughly 30–50 seconds; this cold start is expected during demos and is not an application failure.

MongoDB Atlas must allow traffic from the deployed API. Render's free tier uses shared outbound IP ranges, so this demo uses Atlas Network Access `0.0.0.0/0`; compensate with a strong, unique database password and least-privilege database user. A paid Render service should instead use its dedicated outbound IPs and restrict Atlas to those addresses.

## S3 export storage

The server uses the standard AWS credential provider chain, so local credentials can come from `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`, while deployed workloads should use an IAM role. Grant `s3:PutObject` and `s3:GetObject` on `arn:aws:s3:::<bucket>/exports/*`, plus `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` on `arn:aws:s3:::<bucket>/profile-photos/*`. Keep the bucket private; `/api/exports` reads export metadata from MongoDB and profile-photo URLs are refreshed as signed URLs during authentication, so `s3:ListBucket` is not required.

For automatic retention, apply a bucket lifecycle rule to the `exports/` prefix. For example, this rule removes generated artifacts after 90 days:

```json
{
  "Rules": [
    {
      "ID": "ExpireDatawhisperExports",
      "Status": "Enabled",
      "Filter": { "Prefix": "exports/" },
      "Expiration": { "Days": 90 }
    }
  ]
}
```

## Design

Datawhisper uses a dark-first, near-black interface with Ultra Violet (`#6E3AFF`) as its primary accent and Soft Apricot (`#FFB088`) for secondary highlights. A restrained violet-to-apricot gradient appears on key actions, active states, and identity marks, with a user-selectable vivid or muted accent intensity.

## Roadmap

- Dashboard with demo data
- Chat interface
- AI query engine
- Dynamic charts
- Query history
- Export PNG/CSV
