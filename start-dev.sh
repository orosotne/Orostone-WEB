#!/bin/bash
# Skript na spustenie dev servera – spustite v termináli: ./start-dev.sh

cd "$(dirname "$0")"

if ! command -v node &>/dev/null; then
  echo "❌ Node.js nie je nainštalovaný alebo nie je v PATH."
  echo ""
  echo "Možnosti:"
  echo "1. Nainštalujte Node.js z https://nodejs.org"
  echo "2. Ak používate nvm: otvorte nový terminál a skúste znova"
  echo "3. Spustite Cursor z terminálu: cd $(pwd) && cursor ."
  exit 1
fi

echo "▶ Spúšťam dev server na http://localhost:3000"
npm run dev
