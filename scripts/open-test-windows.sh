#!/bin/bash

# Script para abrir múltiples ventanas de prueba en macOS

echo "🚀 Abriendo ventanas de prueba..."

# Abre ventana del admin
open -na "Google Chrome" --args --incognito --new-window "http://localhost:3000/admin"

# Espera un segundo
sleep 1

# Abre 3 ventanas de jugadores
for i in {1..3}; do
  open -na "Google Chrome" --args --incognito --new-window "http://localhost:3000"
  sleep 0.5
done

echo "✅ Ventanas abiertas. Recuerda:"
echo "   - Ventana 1: Admin (crea la sala)"
echo "   - Ventanas 2-4: Jugadores (únete con el código)"

