# CollabSpace

**CollabSpace** is a production-ready collaboration platform built with the **MERN Stack + Next.js**, designed for modern teams to communicate, manage tasks, share documents, and collaborate in real time.

It combines a sleek frontend experience with a scalable backend architecture, making it ideal for startups, remote teams, and productivity-focused organizations.

---

## 🌍 Live Demo

🚀 **Try CollabSpace Live:**  
👉 https://collab-space-web-vql4.vercel.app/

---

## 🚀 Core Features

### 🔐 Authentication & Security
- JWT-based authentication
- Access token + refresh token rotation
- httpOnly cookie support for secure sessions
- Protected routes and secure access control

### 💬 Real-Time Communication
- Instant team messaging powered by **Socket.IO**
- Live collaboration updates across workspaces

### 🏢 Workspace Management
- Create and manage team workspaces
- Invite members using secure tokenized links
- Accept invites through dedicated API flow

### 📄 Document Collaboration
- Create, edit, and manage workspace documents
- MongoDB-powered persistent storage

### 📌 Kanban Productivity Board
- Drag-and-drop task management using `@dnd-kit`
- Workflow stages: **To Do, In Progress, Done**

### 📤 File Uploads
- Local multipart upload support for development
- Ready for cloud migration (AWS S3 / Cloudinary)

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO

### Deployment / DevOps
- Docker
- Render
- Vercel

---

## 📂 Project Structure

```bash
apps/
 ├── web   # Next.js frontend
 └── api   # Express backend


````

---

## ⚡ Getting Started (Local Development)

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd collabspace
```

### 2️⃣ Configure Environment Variables

Copy values from:

```bash
.env.example
```

Into:

* Root `.env`
* `apps/api/.env`
* `apps/web/.env`

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Start Development Servers

```bash
npm run dev
```

---

## 🌐 Local Development URLs

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:8000](http://localhost:8000) |

---

## 🔌 Key API Endpoints

### Upload Files

```http
POST /api/v1/uploads
```

### Accept Workspace Invite

```http
POST /api/v1/workspaces/accept-invite/:token
```

---

## 🐳 Docker Production Setup

### Notes

**MongoDB Internal Hostname**

```bash
mongo
```

**Docker MongoDB URI**

```bash
MONGODB_URI=mongodb://mongo:27017/collabspace
```

Place inside:

```bash
apps/api/.env.docker
```

**API Port**

```bash
http://localhost:8000
```

### Build & Run Containers

```bash
docker compose build --no-cache
docker compose up
```

---

## 🛡 Production Patch (April 2026)

This release includes fixes for:

* TypeScript API build blockers
* Multer typing issues
* Seed script imports
* Cookie handling improvements
* Proxy-safe Express settings
* Next.js compatibility updates

---

## 📈 Future Roadmap

* Google OAuth / GitHub OAuth
* Notification system
* Team video meetings
* Rich-text collaborative editor
* Cloud file storage integration
* Analytics dashboard

---

## 👨‍💻 Author

**Created by Pounds Michaels Digitals**
Building scalable SaaS platforms, modern web apps, and digital solutions.

---

## ⭐ Support

If you like this project, consider giving it a **star** on GitHub and sharing it with others.

---

```
```
