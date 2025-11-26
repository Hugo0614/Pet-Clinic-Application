#!/bin/bash

# Pet Clinic Docker Stop Script

echo "🛑 Stopping Pet Clinic containers..."
docker compose down

echo ""
echo "✅ All containers stopped"
echo ""
echo "💡 To remove data volumes as well, run:"
echo "   docker compose down -v"
