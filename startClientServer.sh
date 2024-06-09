#!/bin/bash

# Function to kill the process using the specified port
kill_process_on_port() {
  local port=$1
  local pid=$(lsof -t -i:$port)
  if [ -n "$pid" ]; then
    echo "Killing process on port $port..."
    kill -9 $pid
  fi
}

# Kill any process running on port 3001
kill_process_on_port 3001

# Navigate to the server directory and start the server
cd server
echo "Starting server..."
npm start &

# Navigate to the client directory and start the client
cd ../client
echo "Starting client..."
npm start &

# Wait for all background processes to finish
wait
