
# Qadr Studio - Premium Streetwear E-Commerce

A high-conversion, mobile-first premium streetwear e-commerce application. Featuring a minimal, brutalist-inspired UI, this project represents a complete full-stack solution bridging a modern user interface with a robust, custom backend.

## ✨ Features

* **Premium Storefront**: Immersive home page with sleek typography, smooth animations (powered by Framer Motion), and a strong brutalist brand identity.
* **Dynamic Content Management**: Admin-configurable homepage settings (Hero text, Call-to-action buttons, Marquee banner) allowing real-time content updates without touching the codebase.
* **Complete E-Commerce Flow**: Integrated product catalog, persistent shopping cart functionality, checkout process, and order placement system.
* **Admin Dashboard**: Comprehensive control panel enabling administrators to manage Products (add/edit), track Orders, view Users, and modify core Store Aesthetics.
* **Secure Authentication**: JWT-based secure authentication flow for administrative access and route protection.
* **Lightweight Storage Layer**: Local JSON-based persistent database using LowDB.

## 🛠️ Tech Stack

### Frontend
* **Framework**: [Next.js](https://nextjs.org/) (App Router), React 19
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Native CSS Modules
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Language**: TypeScript
* **Icons**: Lucide React

### Backend
* **Runtime**: [Node.js](https://nodejs.org/en)
* **API Framework**: [Express.js](https://expressjs.com/)
* **Database**: [LowDB](https://github.com/typicode/lowdb) (Lightweight JSON-based file persistence)
* **Security & Auth**: jsonwebtoken (JWT), bcryptjs
* **Utilities**: Multer (for file uploads), CORS

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm, yarn, or pnpm

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Start the Backend API Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The backend will typically start on `http://localhost:5000`.*

3. **Start the Frontend Next.js Application**:
   Open a new terminal tab.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be available at `http://localhost:3000`.*

## 📂 Project Structure

* `/frontend` - The Next.js web application. Contains React components, routing mapping for pages (Admin, Store, Cart, Checkout), API interfacing logic, and cohesive styling.
* `/backend` - The Node.js/Express API layer serving endpoints for authentication, products, carts, admin metrics, and interface configuration.
  * *Database*: Relies on `/backend/data.json` for persistence, avoiding heavy database container overheads during straightforward deployments and testing.

## 🎨 Design & UI
The design focuses on dark, minimalist aesthetics prioritizing large typography, high-contrast streetwear photography, and subtle micro-interactions to create a striking first impression mimicking premium fashion boutiques.

---
*Built organically as a comprehensive showcase of modern full-stack application development.*
