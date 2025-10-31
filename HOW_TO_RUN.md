# 🚀 How to Run SoleSphere

## Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

---

## 📦 Quick Start Guide

### Step 1: Clone and Navigate
```bash
cd "c:\Users\Shibi R Shetty\CascadeProjects\windsurf-project"
```

### Step 2: Setup Backend

#### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Example for local MongoDB:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/solesphere
JWT_SECRET=mySecretKey123
NODE_ENV=development
```

**Example for MongoDB Atlas:**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/solesphere?retryWrites=true&w=majority
JWT_SECRET=mySecretKey123
NODE_ENV=development
```

#### 2.3 Start Backend Server
```bash
npm run dev
```

✅ Backend should now be running at `http://localhost:5000`

---

### Step 3: Setup Frontend

#### 3.1 Open New Terminal & Install Frontend Dependencies
```bash
cd "c:\Users\Shibi R Shetty\CascadeProjects\windsurf-project\frontend"
npm install --legacy-peer-deps
```

> Note: `--legacy-peer-deps` is required due to React Three Fiber dependencies.

#### 3.2 Configure Frontend Environment (Optional)
Create a `.env` file in the `frontend` folder if needed:
```env
VITE_API_URL=http://localhost:5000
```

#### 3.3 Start Frontend Development Server
```bash
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173` (or another port like 5174 if 5173 is busy)

---

## 🎯 Access the Application

1. **Main Website**: Open browser to `http://localhost:5173`
2. **3D Customizer**: Navigate to `/customize` or click "🎨 Customize" in the navbar
3. **Backend API**: `http://localhost:5000/api`

---

## 📂 Project Structure

```
windsurf-project/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── index.js       # Main server file
│   ├── .env               # Environment variables (create this)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/    # React components (Navbar, 3D Shoe, etc.)
    │   ├── pages/         # Page components (Home, Customizer, etc.)
    │   ├── state/         # Context providers (Auth, Cart)
    │   ├── utils/         # Utility functions
    │   ├── App.jsx        # Main app component
    │   ├── main.jsx       # Entry point
    │   └── styles.css     # Global styles
    ├── index.html
    └── package.json
```

---

## 🛠️ Development Commands

### Backend Commands
```bash
cd backend

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

### Frontend Commands
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Features Available

### ✅ E-Commerce Features
- Product browsing
- User authentication (login/signup)
- Shopping cart
- Product reviews
- Sell your sneakers
- View your listings

### ✅ 3D Customizer Features (New!)
- Interactive 3D shoe model
- Real-time color customization
- 8 customizable parts (base, toe, tongue, sides, sole, heel, logo, laces)
- 6 preset color schemes
- 21+ color palette options
- Custom color picker
- Save designs to local storage
- Auto-rotate controls
- Mobile responsive

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `Cannot connect to MongoDB`
- **Solution**: Make sure MongoDB is running locally or your Atlas connection string is correct

**Problem**: `Port 5000 already in use`
- **Solution**: Change the PORT in `.env` to another port like 5001

### Frontend Issues

**Problem**: `Port 5173 already in use`
- **Solution**: Vite will automatically try the next available port (5174, 5175, etc.)

**Problem**: `Module not found` errors
- **Solution**: Run `npm install --legacy-peer-deps` again

**Problem**: 3D customizer not loading
- **Solution**: Check browser console for WebGL errors. Make sure your browser supports WebGL.

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add to cart (requires auth)
- `PUT /api/cart` - Update cart item (requires auth)
- `DELETE /api/cart/:productId` - Remove from cart (requires auth)

### Reviews
- `GET /api/reviews/product/:id` - Get product reviews
- `POST /api/reviews` - Create review (requires auth)

---

## 🚀 Deployment

### Backend Deployment (Render, Railway, etc.)
1. Push code to GitHub
2. Set environment variables on hosting platform
3. Deploy from repository

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL

---

## 💡 Tips

- Keep both backend and frontend servers running simultaneously
- Backend must be running for authentication and data features
- Frontend can run standalone for UI testing
- Use browser DevTools to debug issues
- Check console for error messages

---

## 📞 Need Help?

Check the browser console and terminal for error messages. Common issues are usually related to:
- Missing environment variables
- MongoDB connection
- Port conflicts
- Missing dependencies

---

**Brand**: SoleSphere  
**Theme**: Dark mode with neon green accents  
**Tech Stack**: React, Three.js, Node.js, Express, MongoDB
