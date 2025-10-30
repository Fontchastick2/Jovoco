# Jovoco - E-Commerce Full Stack

Modern e-commerce app with Angular, NestJS, and PostgreSQL. Features product catalog, shopping cart, order management, and admin dashboard with animations.

## Tech Stack

- **Frontend**: Angular 17, TypeScript, Material, TailwindCSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Auth**: JWT

## Prerequisites

- Node.js 18+, Docker, Docker Compose

## Quick Start

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

Creates PostgreSQL container with:
- **User**: `admin`
- **Password**: `admin123`
- **Database**: `mydb`
- **Port**: `5432`

**Note**: The NestJS backend runs automatically in Docker. It connects to the PostgreSQL database and is accessible at `http://localhost:3000`

### 2. Start Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`

## Features

- JWT Authentication & user management
- Product catalog with real-time search & filtering
- Shopping cart & checkout with order tracking
- Admin dashboard (products, users, orders management)

