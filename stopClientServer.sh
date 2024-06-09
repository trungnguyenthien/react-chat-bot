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

# Kill any process running on ports 3000 and 5000
kill_process_on_port 3000
kill_process_on_port 3001
