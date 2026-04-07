# ResumeCraft - AI-Powered Resume Builder

## Project Overview
ResumeCraft (also known as ResumeBanau) is an AI-powered resume building and analysis platform. It helps users create, optimize, and analyze resumes with intelligent ATS (Applicant Tracking System) compatibility suggestions.

## Architecture
- **Frontend**: React 18 + Vite, running on port 5000
- **Backend**: Node.js + Express, running on port 5001
- **Database**: MongoDB (via MONGODB_URI secret)
- **Real-time**: Socket.io for collaboration features

## Tech Stack

### Frontend (`/frontend`)
- React 18, Vite, Tailwind CSS
- Framer Motion (animations), TanStack Query, Zustand
- React Router 6, Ant Design, Material UI
- DnD Kit (drag-and-drop)

### Backend (`/backend`)
- Express.js, Mongoose, JWT auth
- Socket.io (real-time collaboration)
- AI integrations: OpenAI, Groq, Anthropic
- PDF generation: Puppeteer + PDFKit
- File parsing: Mammoth (DOCX), pdf-parse, Tesseract.js (OCR)

## Running the App

### Development
```bash
bash start.sh
```
This starts both backend (port 5001) and frontend (port 5000).

### Workflow
The "Start application" workflow runs `bash start.sh` and waits on port 5000.

## Environment Variables / Secrets
- `MONGODB_URI` - MongoDB Atlas connection string (required)
- `PORT` - Backend port (default: 5001)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS
- `OPENAI_API_KEY` - Optional: OpenAI API key for AI features
- `GROQ_API_KEY` - Optional: Groq API key for AI features
- `VITE_GOOGLE_CLIENT_ID` - Optional: Google OAuth client ID

## Project Layout
```
/
├── frontend/          # React Vite SPA
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # React contexts
│   │   ├── services/    # API calls
│   │   └── App.jsx      # Root component
│   └── vite.config.js   # Port 5000, host 0.0.0.0, allowedHosts: true
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Mongoose schemas
│   │   ├── services/    # Business services
│   │   └── middleware/  # Auth, error handling
│   └── server.js        # Entry point
└── start.sh           # Startup script for both services
```

## Notes
- Puppeteer browser download is skipped (PUPPETEER_SKIP_DOWNLOAD=true) in Replit
- Backend uses `--ignore-scripts` flag during npm install to avoid puppeteer Chrome download
- Frontend proxies `/api` requests to `http://localhost:5001`
