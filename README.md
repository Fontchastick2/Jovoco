# Jovoco - Full Stack Application

Ce projet contient une application full-stack avec un frontend Angular, un backend NestJS et une base de données PostgreSQL.

## Structure du projet

```
.
├── frontend/          # Application Angular
├── backend/           # API NestJS
├── docker-compose.yml # Configuration PostgreSQL
└── README.md          # Ce fichier
```

## Prérequis

- Node.js 18+ et npm
- Docker et Docker Compose
- Angular CLI (`npm install -g @angular/cli`)
- NestJS CLI (`npm install -g @nestjs/cli`)

## Démarrage rapide

### 1. Démarrer la base de données PostgreSQL

```bash
docker-compose up -d
```

Cela va créer et démarrer un conteneur PostgreSQL avec :
- **User**: `jovoco_user`
- **Password**: `jovoco_password`
- **Database**: `jovoco_db`
- **Port**: `5432`

### 2. Démarrer le backend NestJS

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3000`

### 3. Démarrer le frontend Angular

```bash
cd frontend
npm install
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## Commandes utiles

### Backend
- `npm run start` - Démarrer en mode production
- `npm run start:dev` - Démarrer en mode développement avec hot-reload
- `npm run build` - Compiler le projet
- `npm test` - Lancer les tests unitaires
- `npm run test:e2e` - Lancer les tests e2e

### Frontend
- `npm start` - Démarrer le serveur de développement
- `npm run build` - Compiler pour la production
- `npm test` - Lancer les tests
- `npm run lint` - Vérifier le code

### Base de données
- `docker-compose up -d` - Démarrer PostgreSQL
- `docker-compose down` - Arrêter PostgreSQL
- `docker-compose logs postgres` - Voir les logs

## Configuration

### Backend
Voir `backend/.env.example` pour les variables d'environnement disponibles.

### Frontend
Le frontend est configuré pour communiquer avec le backend sur `http://localhost:3000` par défaut.

## Architecture

- **Frontend**: Angular avec routing et composants
- **Backend**: NestJS avec TypeORM et PostgreSQL
- **Database**: PostgreSQL 16 Alpine

## Prochaines étapes

1. Créer des entités TypeORM dans le backend
2. Créer des services et contrôleurs NestJS
3. Développer les composants Angular
4. Ajouter l'authentification
5. Configurer CORS si nécessaire
