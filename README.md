# TradeSphere AI 📈

TradeSphere AI is a modern, real-time stock trading application featuring professional visualizations, 3D interactive graphics, and secure user management.

## 🚀 Features
- **Real-time Dashboard**: Track your equity, holdings, and positions with live updates.
- **Interactive Visualizations**: High-performance charts using Chart.js and Recharts.
- **3D Graphics**: Immersive 3D stock market-themed components built with Three.js (Fiber/Drei).
- **Secure Authentication**: User sign-up and login with session management and JWT protection.
- **Trade Execution**: Support for buy/sell operations with instant feedback and balance updates.
- **Watchlist**: Manage your favorite stocks with search and tracking capabilities.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v19)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS, Bootstrap + React-Bootstrap
- **UI Components**: MUI (Material UI)
- **Animations**: Framer Motion
- **3D Rendering**: Three.js, @react-three/fiber, @react-three/drei
- **Charts**: Chart.js, Recharts
- **Data Fetching**: Axios
- **Form Management**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB (with Mongoose ODM)
- **Security**: Passport.js (Local Strategy), JWT, Bcrypt.js
- **State Management**: express-session with connect-mongo store

---

## 🏃 How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/sawantyash07/TradeSphereAI.git
cd TradeSphereAI
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
```

### 3. Setup and Run Backend
```bash
cd backend
npm install
npm run dev  # (or npm start)
```

### 4. Setup and Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```

The application should now be running:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 📄 License
This project is licensed under the MIT License.
