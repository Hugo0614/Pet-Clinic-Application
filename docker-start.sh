#!/bin/bash

# Pet Clinic Docker Quick Start Script
# This script builds and launches all containers

set -e

echo "🐳 Pet Clinic Docker Deployment"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed (V2 uses 'docker compose')
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please review .env file and update JWT_SECRET for production!"
fi

echo "🔨 Building Docker images..."
docker compose build

echo ""
echo "🚀 Starting containers..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Wait for MySQL
echo "   Checking MySQL..."
for i in {1..30}; do
    if docker compose exec -T mysql mysqladmin ping -h localhost -u root -prootpass123 &> /dev/null; then
        echo "   ✅ MySQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "   ⚠️  MySQL health check timeout"
    fi
    sleep 2
done

# Wait for Backend
echo "   Checking Backend..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/auth/health &> /dev/null; then
        echo "   ✅ Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "   ⚠️  Backend health check timeout"
    fi
    sleep 2
done

# Check Frontend
echo "   Checking Frontend..."
for i in {1..10}; do
    if curl -s http://localhost/ &> /dev/null; then
        echo "   ✅ Frontend is ready"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "   ⚠️  Frontend health check timeout"
    fi
    sleep 2
done

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:8080"
echo "   MySQL:     localhost:3306"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker compose logs -f"
echo "   Stop services:    docker compose down"
echo "   Restart service:  docker compose restart [service-name]"
echo ""
echo "🎉 Happy testing!"
