# Jovoco - E-Commerce Full Stack Application

A modern full-stack e-commerce application built with Angular, NestJS, and PostgreSQL. Features a beautiful UI with animations, product catalog, shopping cart, order management, and admin dashboard.

## Project Structure

```
jovoco/
├── frontend/                 # Angular 17+ Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── main/        # Main layout with header, footer, routing
│   │   │   │   ├── pages/   # Home, Catalog, Orders, Profile
│   │   │   │   └── main.routes.ts
│   │   │   ├── admin/       # Admin dashboard
│   │   │   │   ├── dashboard/
│   │   │   │   └── pages/   # Orders management, Products, Users
│   │   │   ├── auth/        # Authentication pages
│   │   │   └── services/    # HTTP services, Auth service
│   │   └── styles/
│   └── package.json
│
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/            # Authentication & JWT
│   │   ├── users/           # User management
│   │   ├── products/        # Product catalog
│   │   ├── orders/          # Orders & cart management
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── docker-compose.yml       # PostgreSQL configuration
└── README.md
```

## Tech Stack

- **Frontend**: Angular 17, TypeScript, Angular Material, TailwindCSS
- **Backend**: NestJS, TypeORM, PostgreSQL
- **Database**: PostgreSQL 16 Alpine
- **Authentication**: JWT
- **Deployment**: Docker, Netlify (Frontend), Docker (Backend)

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Angular CLI: `npm install -g @angular/cli`
- NestJS CLI: `npm install -g @nestjs/cli`

## Quick Start

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

Creates PostgreSQL container with:
- **User**: `jovoco_user`
- **Password**: `jovoco_password`
- **Database**: `jovoco_db`
- **Port**: `5432`

### 2. Start Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

Backend runs on `http://localhost:3000`

### 3. Start Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`

## Key Features

- **User Authentication**: JWT-based login/signup
- **Product Catalog**: Browse products with filtering and search
- **Shopping Cart**: Add/remove items, real-time total calculation
- **Order Management**: View order history, track status
- **Admin Dashboard**: Manage products, users, and orders
- **Responsive Design**: Mobile-friendly UI with animations
- **Search**: Real-time product search with database matching

## Useful Commands

### Backend
- `npm run start` - Production mode
- `npm run start:dev` - Development with hot-reload
- `npm run build` - Build project
- `npm test` - Run unit tests
- `npm run test:e2e` - Run e2e tests

### Frontend
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run lint` - Lint code

### Database
- `docker-compose up -d` - Start PostgreSQL
- `docker-compose down` - Stop PostgreSQL
- `docker-compose logs postgres` - View logs

## API Endpoints

### Authentication
- `POST /auth/signup` - Register user
- `POST /auth/login` - Login user

### Products
- `GET /products` - Get all products
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Get product details
- `GET /products/category/:category` - Get by category

### Orders
- `GET /orders/cart/:userId` - Get user's cart
- `POST /orders/:orderId/add-item` - Add item to cart
- `DELETE /orders/:orderId/items/:productId` - Remove item
- `POST /orders/:orderId/checkout` - Checkout order
- `PUT /orders/:orderId/status` - Update order status

### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user

## Environment Variables

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=jovoco_user
DATABASE_PASSWORD=jovoco_password
DATABASE_NAME=jovoco_db
JWT_SECRET=your_jwt_secret
```

### Frontend
API URL: `http://localhost:3000` (configurable in services)

## Project Highlights

- Modern Angular architecture with standalone components
- Real-time search with database integration
- Smooth animations and transitions
- Admin panel for order and product management
- Responsive design for all devices
- Clean code structure with services and components separation

## Next Steps

1. Deploy frontend to Netlify
2. Deploy backend to cloud provider (Heroku, AWS, etc.)
3. Add email notifications
4. Implement payment integration
5. Add product reviews and ratings
