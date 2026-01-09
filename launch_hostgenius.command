#!/bin/bash
cd "$(dirname "$0")"

# Source user profile to ensure npm/node are found
if [ -f ~/.zshrc ]; then
  source ~/.zshrc
elif [ -f ~/.bash_profile ]; then
  source ~/.bash_profile
fi

echo "----------------------------------------------------------------"
echo "  Starting HostGenius Cost & Growth Calculator (Dev Mode)"
echo "----------------------------------------------------------------"
echo "  > This window must stay open for the app to run."
echo "  > Press Ctrl+C to stop."
echo "----------------------------------------------------------------"

# Run npm install if node_modules is missing (first run safety)
if [ ! -d "node_modules" ]; then
    echo "First time setup: Installing dependencies..."
    npm install
fi

# Start the dev server and open the browser
# using --open to let Vite handle the URL and port correctly
npm run dev -- --open
