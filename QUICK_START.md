# ⚡ SOLESPHERE - QUICK START

## 🚀 Run in 3 Steps

### 1️⃣ Setup Backend (First Terminal)
```bash
cd backend
npm install
```

Create `.env` file in `backend` folder (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/solesphere
JWT_SECRET=mySecretKey123
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

---

### 2️⃣ Setup Frontend (Second Terminal)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

✅ Frontend running at `http://localhost:5173` (or 5174)

---

### 3️⃣ Open Browser
Go to: `http://localhost:5173`

---

## 🎯 Key Features to Try

1. **Browse Products** - Homepage
2. **3D Customizer** - Click "🎨 Customize" in navbar
3. **Signup/Login** - Top right
4. **Add to Cart** - Product pages
5. **Customize Shoe** - Change colors in real-time!

---

## 🛑 Already Running?

If you see "Port already in use":
- **Backend**: It's already running! Check `http://localhost:5000/api/health`
- **Frontend**: Vite will use next port automatically (5174, 5175, etc.)

---

## 💾 Save Your Design

In the customizer:
1. Pick colors for each shoe part
2. Click "💾 Save Design"
3. Design saved to browser storage!

---

**Need detailed instructions?** See `HOW_TO_RUN.md`
