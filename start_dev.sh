#!/bin/bash

##############################################
# Pet Clinic Full Stack Development Launcher
# Starts backend and frontend in parallel
##############################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/petclinic-backend"
FRONTEND_DIR="$PROJECT_ROOT/petclinic-frontend"

# PID tracking
BACKEND_PID=""
FRONTEND_PID=""

# Cleanup function - kills all child processes
cleanup() {
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}Shutting down services...${NC}"
    echo -e "${YELLOW}========================================${NC}"
    
    if [ -n "$BACKEND_PID" ]; then
        echo -e "${BLUE}Stopping backend (PID: $BACKEND_PID)${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "${BLUE}Stopping frontend (PID: $FRONTEND_PID)${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        wait $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining processes on ports 8080 and 5173
    pkill -f "petclinic-backend-1.0.0.jar" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    echo -e "${GREEN}All services stopped successfully${NC}"
    exit 0
}

# Register cleanup function for SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

# Check if MySQL is accessible with petuser
check_mysql() {
    echo -e "${BLUE}Checking MySQL connection with petuser...${NC}"
    if mysql -u petuser -pPetPass123_ -e "USE pet_clinic; SELECT 'Connected' AS Status;" > /dev/null 2>&1; then
        echo -e "${GREEN}MySQL connection verified${NC}"
        return 0
    else
        echo -e "${RED}MySQL connection failed${NC}"
        echo -e "${YELLOW}Please ensure:${NC}"
        echo "  1. MySQL is running: sudo systemctl status mysql"
        echo "  2. User petuser exists with password PetPass123_"
        echo "  3. Database pet_clinic exists"
        echo ""
        echo "See DEPLOYMENT_FIX.md for detailed instructions"
        return 1
    fi
}

# Start backend
start_backend() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Starting Backend (Spring Boot)${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    cd "$BACKEND_DIR"
    
    # Check if JAR exists, if not build it
    if [ ! -f "target/petclinic-backend-1.0.0.jar" ]; then
        echo -e "${YELLOW}Building backend JAR...${NC}"
        mvn clean package -DskipTests
    fi
    
    # Set environment variables
    export DB_USER=petuser
    export DB_PASS=PetPass123_
    export JWT_SECRET="prod-secret-$(openssl rand -base64 32 | tr -d '\n')"
    
    # Start backend in background
    java -jar target/petclinic-backend-1.0.0.jar > "$PROJECT_ROOT/backend.log" 2>&1 &
    BACKEND_PID=$!
    
    echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "${BLUE}Log file: $PROJECT_ROOT/backend.log${NC}"
    echo ""
    
    # Wait for backend to be ready
    echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8080 > /dev/null 2>&1; then
            echo -e "${GREEN}Backend is ready at http://localhost:8080${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo ""
    echo -e "${RED}Backend failed to start. Check backend.log${NC}"
    tail -20 "$PROJECT_ROOT/backend.log"
    return 1
}

# Start frontend
start_frontend() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Starting Frontend (Vite + React)${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in background
    npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${BLUE}Log file: $PROJECT_ROOT/frontend.log${NC}"
    echo ""
    
    # Wait for frontend to be ready
    echo -e "${YELLOW}Waiting for frontend to initialize...${NC}"
    local max_attempts=20
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            echo -e "${GREEN}Frontend is ready at http://localhost:5173${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo ""
    echo -e "${YELLOW}Frontend may still be starting...${NC}"
    return 0
}

# Main execution
main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Pet Clinic Development Launcher${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    # Check MySQL first
    if ! check_mysql; then
        exit 1
    fi
    
    echo ""
    
    # Start backend
    if ! start_backend; then
        echo -e "${RED}Failed to start backend${NC}"
        exit 1
    fi
    
    # Start frontend
    if ! start_frontend; then
        echo -e "${RED}Failed to start frontend${NC}"
        exit 1
    fi
    
    # Summary
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  All Services Running${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Backend:${NC}  http://localhost:8080"
    echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
    echo ""
    echo -e "${BLUE}Logs:${NC}"
    echo "  Backend:  $PROJECT_ROOT/backend.log"
    echo "  Frontend: $PROJECT_ROOT/frontend.log"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    echo ""
    
    # Keep script running and wait for signals
    wait
}

# Run main function
main
