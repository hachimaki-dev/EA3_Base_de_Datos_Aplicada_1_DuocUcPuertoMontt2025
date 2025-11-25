#!/bin/bash
# Script para iniciar servidor local de desarrollo
# Necesario para que los ES Modules funcionen sin errores de CORS

echo "🚀 Iniciando servidor de desarrollo para SQL Mastery..."
echo "📂 Directorio: $(pwd)"
echo "🌐 Abriendo http://localhost:8000"

# Intentar abrir el navegador (macOS)
open http://localhost:8000/index.html &

# Verificar si el puerto 8000 ya está en uso
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ El puerto 8000 ya está en uso. El servidor probablemente ya está corriendo."
    echo "🌐 Puedes acceder en http://localhost:8000"
else
    # Iniciar servidor Python (compatible con Mac pre-instalado)
    python3 -m http.server 8000
fi
