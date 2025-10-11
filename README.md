# Skillmate Monorepo

Packages:
- apps/web: React (Vite)
- apps/mobile: React Native (Expo)
- services/server: Node.js + Express + MongoDB + Socket.IO + AWS S3 + FCM
- services/ai: FastAPI microservice for recommendations
- infra/lambda: AWS Lambda stubs

## Getting Started

1) Server
```bash
cp services/server/.env.example services/server/.env
npm install
npm --workspace services/server install
npm run dev:server
```

2) AI service
```bash
cd services/ai
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 5005
```

3) Web app
```bash
npm --workspace apps/web install
npm run dev:web
```

4) Mobile app (Expo)
```bash
npm --workspace apps/mobile install
npm run dev:mobile
```

Set `VITE_API_BASE` (web) and `API_BASE` (mobile) to point to server.

## API Routes
- /api/users
- /api/skills
- /api/match
- /api/chat
- /api/feedback
- /api/admin
- /api/uploads

Schemas in `services/server/src/models`.
