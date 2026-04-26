# CollabSpace

Production-oriented MERN + Next.js MVP for real-time team collaboration.

## Included in this hardened release
- Next.js App Router frontend
- Express + MongoDB backend
- Socket.IO real-time chat
- JWT access tokens
- Refresh-token rotation with httpOnly cookie support
- Workspace bootstrap flow
- Invite flow with tokenized acceptance endpoint
- Document editing backed by MongoDB
- Drag-and-drop kanban board using `@dnd-kit`
- Local multipart uploads endpoint for development
- Docker, Render, and Vercel starter configs

## Run locally
1. Copy `.env.example` values into the root and app-level env files.
2. Install dependencies from the repo root.
3. Start MongoDB locally or point to MongoDB Atlas.
4. Run the API and web app.

```bash
npm install
npm run dev
```

API: `http://localhost:8000`
Web: `http://localhost:3000`

## Notes
- Uploads default to local disk storage for development via `POST /api/v1/uploads`.
- Refresh uses an httpOnly cookie and also returns a refresh token in the response payload to simplify local dev.
- Invite acceptance endpoint is available at `POST /api/v1/workspaces/accept-invite/:token`.

Footer across the product: **Created by Pounds Michaels Digitals**


## April 2026 production patch

This package includes fixes for the API TypeScript build blockers, multer typing, seed script imports, cookie handling, proxy-safe Express settings, and a compatibility-safe Next.js config.


## Docker Production Notes

- The Docker stack uses `mongo` as the internal MongoDB hostname.
- For Docker, set `MONGODB_URI=mongodb://mongo:27017/collabspace` in `apps/api/.env.docker`.
- The API is exposed on `http://localhost:8000` to avoid macOS conflicts on port 5000.
- If Docker dependency downloads are slow, retry `docker compose build --no-cache` because npm registry timeouts can be transient.
