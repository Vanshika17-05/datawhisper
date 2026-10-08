# Datawhisper

Chat with your database in plain English and turn answers into useful visualizations.

## Tech stack

- React, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion
- Express, MongoDB with Mongoose, Zod
- Google Gemini (planned query generation)

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
| `GEMINI_API_KEY` | `server/.env` | Yes | Google Gemini API key |
| `JWT_SECRET` | `server/.env` | Yes | Secret of at least 32 characters used to sign login sessions |
| `GEMINI_MODEL` | `server/.env` | No | Gemini model; defaults to `gemini-2.5-flash` |
| `CLIENT_URL` | `server/.env` | No | Comma-separated allowed CORS origins |
| `NODE_ENV` | `server/.env` | No | Runtime environment |
| `VITE_API_URL` | `client/.env` | No | Browser-facing API base URL |

## Design

Datawhisper uses a dark-first, near-black interface with Ultra Violet (`#6E3AFF`) as its primary accent and Soft Apricot (`#FFB088`) for secondary highlights. A restrained violet-to-apricot gradient appears on key actions, active states, and identity marks, with a user-selectable vivid or muted accent intensity.

## Roadmap

- Dashboard with demo data
- Chat interface
- AI query engine
- Dynamic charts
- Query history
- Export PNG/CSV
