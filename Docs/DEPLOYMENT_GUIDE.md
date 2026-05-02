# CollabSpace — Deployment Guide

## Recommended Deployment Strategy

### Frontend
Deploy `apps/web` to **Vercel**

### Backend
Deploy `apps/api` to **Render** or **Railway**

### Database
Use **MongoDB Atlas** for production

---

## Frontend Deployment (Vercel)

### Recommended Settings
- Root Directory: `apps/web`
- Framework: Next.js
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty

### Required Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-domain/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain