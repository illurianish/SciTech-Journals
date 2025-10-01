#!/bin/bash
echo "=== Starting AriesView React Frontend with Docker ==="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Building and starting the React frontend..."
docker-compose up --build -d

echo ""
echo "=== Waiting for the application to be ready ==="
sleep 5

echo ""
echo "=== AriesView is now running ==="
echo ""
echo "Access the application at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop viewing logs"
echo ""

docker-compose logs -f 