# SoleSphere - Custom Sneaker Designer (Black/Green Theme)

A premium e-commerce platform for sneaker enthusiasts with an interactive 3D shoe customizer.

## Backend Setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - From backend folder: `npm install`
3. Run dev server:
   - `npm run dev`

### API Routes
- `GET /api/health`
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/auth/me` (Bearer token)
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/reviews/product/:id`
- `GET /api/reviews/product/:id/summary`
- `POST /api/reviews` (Bearer token) { productId, rating, comment? }
- `GET /api/cart` (Bearer token)
- `POST /api/cart` (Bearer token) { productId, quantity }
- `PUT /api/cart` (Bearer token) { productId, quantity }
- `DELETE /api/cart/:productId` (Bearer token)

## Frontend Setup (to be scaffolded with Vite React)

1. `npm create vite@latest frontend -- --template react`
2. `cd frontend && npm install`
3. Configure proxy or set `VITE_API_URL=http://localhost:5000`
4. Run: `npm run dev`

## Theme
- Black background, green accents, white/gray text.
