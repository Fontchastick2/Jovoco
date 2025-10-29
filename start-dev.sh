#!/bin/bash

# Script de démarrage pour Jovoco (DB + Backend)
# Usage: ./start-dev.sh

echo ""
echo "========================================"
echo "  JOVOCO - Démarrage DB + Backend"
echo "========================================"
echo ""

# Démarrer PostgreSQL
echo "[1/2] Démarrage de PostgreSQL..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Erreur: Impossible de démarrer PostgreSQL"
    exit 1
fi

echo "PostgreSQL démarré ✓"
echo ""

# Attendre que PostgreSQL soit prêt
echo "Attente du démarrage de PostgreSQL (5 secondes)..."
sleep 5

# Démarrer le backend
echo ""
echo "[2/2] Démarrage du Backend NestJS..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Création du fichier .env..."
    cp .env.example .env
fi

echo ""
echo "========================================"
echo "  Backend en cours de démarrage..."
echo "========================================"
echo ""
echo "Accédez à l'API sur: http://localhost:3000"
echo ""

npm run start:dev
