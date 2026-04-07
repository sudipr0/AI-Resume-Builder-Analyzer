#!/bin/bash
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start backend in background
cd "$ROOT_DIR/backend" && node server.js &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start frontend in foreground on port 5000
cd "$ROOT_DIR/frontend" && npx vite --port 5000 --host 0.0.0.0

# If frontend exits, kill backend
kill $BACKEND_PID
