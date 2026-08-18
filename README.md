# EcomShop - Full Stack E-Commerce Platform

Professional e-commerce store built with the MERN stack (MongoDB, Express, React, Node.js). All prices in PKR with JazzCash & COD payment support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Payments | JazzCash (simulated) + Cash on Delivery |

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Setup

```bash
# Install all dependencies
npm run install-all

# Configure environment
cd server
# Edit .env with your MongoDB URI

# Seed the database with 24 products
npm run seed

# Start development (server + client)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Admin Login
- Email: `admin@ecomshop.pk`
- Password: `admin123`

## Features

### Customer
- Browse products with category filters, search, and sorting
- Product detail pages with ratings
- Shopping cart with quantity management
- JazzCash mobile payment integration
- Cash on Delivery option
- Order tracking and history
- User registration and login
- Responsive design (mobile, tablet, desktop)

### Admin Dashboard
- Sales overview with charts (monthly revenue, category stats)
- Order management (view, update status)
- Product CRUD (add, edit, delete products)
- User management

## Project Structure

```
E-COm/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # Navbar, Footer, ProductCard
│   │   ├── pages/        # 13 page components
│   │   ├── context/      # Auth + Cart state
│   │   └── utils/        # API client + helpers
├── server/          # Node.js backend
│   ├── models/      # User, Product, Order, Category
│   ├── routes/      # API routes
│   ├── controllers/ # Business logic
│   ├── middleware/   # JWT auth + error handling
│   ├── config/      # DB connection
│   └── seed.js      # Database seeder
├── images/          # Product images
└── package.json     # Root scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/products | List products (with filters) |
| GET | /api/products/:id | Product detail |
| POST | /api/orders | Create order |
| GET | /api/orders/my | My orders |
| GET | /api/orders/dashboard | Admin stats |

## Pricing

All prices in Pakistani Rupees (PKR). Free shipping on orders above Rs. 5,000. 5% sales tax applied.
