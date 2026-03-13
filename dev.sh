#!/bin/bash

# NetRoulette Development Script
# Runs both server and client concurrently

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}Starting NetRoulette Development Environment${NC}"
echo ""

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Error: bun is not installed${NC}"
    exit 1
fi

# Trap to kill background processes on exit
cleanup() {
    echo ""
    echo -e "${BLUE}Shutting down...${NC}"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start server
echo -e "${GREEN}Starting server on http://localhost:3001${NC}"
(cd "$SCRIPT_DIR/server" && bun run start:dev) &
SERVER_PID=$!

# Wait a moment for server to initialize
sleep 2

# Start client
echo -e "${GREEN}Starting client on http://localhost:5173${NC}"
(cd "$SCRIPT_DIR/client" && bun run dev) &
CLIENT_PID=$!

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}NetRoulette is running!${NC}"
echo -e "  Client: ${BLUE}http://localhost:5173${NC}"
echo -e "  Server: ${BLUE}http://localhost:3001${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Press Ctrl+C to stop"

# Wait for both processes
wait
