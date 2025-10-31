# 🚀 SOLESPHERE - HOW TO RUN

## ✅ EASIEST METHOD (Recommended)

**Just double-click this file:**
```
RUN_SOLESPHERE.bat
```
This will:
- ✅ Stop any old servers
- ✅ Start backend automatically
- ✅ Start frontend automatically  
- ✅ Open your browser

---

## 📋 MANUAL METHOD (If batch file doesn't work)

### Step 1: Open TWO terminals in VS Code

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
**Wait for:** `Server running on port 5000`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
**Wait for:** `Local: http://localhost:5173/`

### Step 3: Open Browser
```
http://localhost:5173
```

---

## 🛑 HOW TO STOP

### Method 1: Close Terminal Windows
Just close the two terminal windows that opened.

### Method 2: Use Keyboard
Press `Ctrl + C` in each terminal.

### Method 3: Kill All Processes
Run: `taskkill /F /IM node.exe`

---

## ⚠️ TROUBLESHOOTING

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Then start again
cd backend
npm run dev
```

### Problem: "Port 5173 already in use"
**Solution:**
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Then start again
cd frontend
npm run dev
```

### Problem: "No products showing"
**Solution:**
```bash
cd backend
npm run seed
```

### Problem: Blank/White screen
**Solution:**
1. Press `Ctrl + Shift + R` to hard refresh
2. Press `F12` and check Console for errors
3. Make sure backend is running on port 5000

---

## ✅ WHAT YOU SHOULD SEE

When you open `http://localhost:5173`:

1. ✅ Dark black background with green accents
2. ✅ **SOLESPHERE** navbar at top
3. ✅ 3D rotating shoe animation
4. ✅ "Premium Sneakers" heading
5. ✅ Filter controls (Price, Rating, Brands)
6. ✅ 12 product cards with images
7. ✅ Cart icon in navbar
8. ✅ Login/Signup links

---

## 🎨 FEATURES TO TRY

### 1. Browse Products
- Scroll through 12 sneaker cards
- Use price slider ($0-$1000)
- Filter by rating (0★-5★)
- Check brand boxes

### 2. 3D Customizer
- Click **"🎨 Customize"** in navbar
- See interactive 3D shoe
- Try 6 preset themes:
  - Classic Black
  - Pure White
  - Neon Green
  - Royal Blue
  - Crimson Red
  - Sunset Orange
- Click shoe parts (Base, Toe, Sole, etc.)
- Pick custom colors
- Click "💾 Save Design"

### 3. Product Details
- Click any product card
- See full details
- View reviews
- Add to cart (requires login)

### 4. Shopping Cart
- Click "Cart" in navbar
- View cart items
- Update quantities
- Proceed to checkout

### 5. User Account
- Click "Signup" to create account
- Click "Login" to sign in
- View "My Sneakers"
- Sell your sneakers

---

## 📊 SERVER STATUS CHECK

Run this to check if everything is running:
```bash
# Check if backend is running
Test-NetConnection localhost -Port 5000

# Check if frontend is running  
Test-NetConnection localhost -Port 5173

# Check if backend API works
curl http://localhost:5000/api/health

# Check if products exist
curl http://localhost:5000/api/products
```

---

## 🔧 FIRST TIME SETUP

If this is your first time running:

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install --legacy-peer-deps
```

### 2. Seed Database
```bash
cd backend
npm run seed
```

### 3. Run Application
```bash
# Double-click: RUN_SOLESPHERE.bat
# OR use manual method above
```

---

## 📁 PROJECT STRUCTURE

```
windsurf-project/
├── backend/
│   ├── src/
│   │   ├── index.js          (Server entry)
│   │   ├── seed.js           (Database seeder)
│   │   ├── controllers/      (API logic)
│   │   ├── models/           (MongoDB schemas)
│   │   ├── routes/           (API endpoints)
│   │   └── config/           (Database config)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx           (App entry)
    │   ├── App.jsx            (Main component)
    │   ├── components/        (Reusable components)
    │   ├── pages/             (Page components)
    │   ├── state/             (Context providers)
    │   └── utils/             (API utilities)
    └── package.json
```

---

## ✅ FINAL CHECKLIST

Before running, make sure:
- [x] MongoDB is installed and running
- [x] Node.js is installed (v18+)
- [x] Dependencies are installed (npm install)
- [x] Database is seeded (npm run seed)
- [x] No other apps using ports 5000 or 5173

---

**Your SoleSphere sneaker platform is ready to run!** 🎨👟✨
