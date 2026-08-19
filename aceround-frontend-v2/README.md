# AceRound Frontend

## ⚡ Backend setup (read this first)

This frontend now talks to a real backend instead of `localStorage`. The backend
lives in the sibling `backend/` folder (Node.js + Express + MongoDB).

```bash
# 1. Start the backend first
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI, JWT_SECRET (see backend/README.md)
npm run dev                # runs on http://localhost:5000

# 2. Start this frontend
cd Frontend-Project
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api by default
npm run dev                  # runs on http://localhost:3400
```

### What changed from the original version
- **Auth**: login/register/logout now call the backend (`src/services/authApi.js`).
  The session token is stored in an httpOnly cookie by the server — it is **not**
  in `localStorage` anymore, so `useAuth.jsx` no longer touches `localStorage` at all.
- **Interview questions**: `src/data/questions.js` (the old static file) has been
  removed. `pages/Interview.jsx` now fetches the role list from
  `GET /api/questions/roles` and starts an interview via
  `POST /api/interviews/start`, which the backend fulfills using an AI provider
  (Gemini/OpenAI) or a static fallback bank — see `backend/README.md`.
- **Results & Dashboard**: `pages/Results.jsx` and `pages/Dashboard.jsx` now load
  interview history from `GET /api/interviews` (and `GET /api/interviews/:id` for
  full detail) instead of reading `interviewResults_<id>` /
  `aceRoundDetailedResults_<id>` from `localStorage`.
- New `src/services/` folder: `api.js` (fetch wrapper with `credentials: "include"`),
  `authApi.js`, `interviewApi.js`.

---



This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.







-----------------------------------==================================PROJECT EXPLAINATION--------------------------------------==========================================


# DIST
--dist(distribution)-final website yhn pe store hoti hai (or ye tb bnta hai jb npm run dev run hoti hai) , or jo eske andr file hoti hai vo random esliye hoti hai kynki vo tb bnti hai jb website run hoti hai. 
# Random names of files inside dist folder--bcoz of cache optimization.

# Public
Direct browser accessible files.


# Library kya hoti?--Dusro ka likha ready-made code.Taaki hume sab scratch se na banana pade.



# npm(Node Package Manager)-It is used to install lib/packpages or dependencies and to run scripts.


# import React from "react" -- string kyu? coz it is Package name.


SVG = scalable vector graphics.


# React app ka flow:
Browser
   ↓
main.jsx
   ↓
App.jsx
   ↓
Pages
   ↓
Components
   ↓
Rendered UI



# StrictMode - React ka ek development tool hai, Code me possible problems aur bad practices ko detect karna.  StrictMode React ka debugging/helper mode hai jo development me code ki problems dhoondhne me madad karta hai.



# react and reactDom -- react(normal ui banana), reactDom(browser mei ui dikhana)


# react-UI banana(Architect house design karta hai.)
# reactDOM-browser pe ui dikahana(Builder usko actual me banata hai.)


# React Router DOM ka kaam? bcoz of (Routing).
# BrowserRouter kyu? Kyuki ye browser ke URL ko watch karta hai.

# <AuthProvider>  Sab pages ko user ki login information chahiye.
# <BrowserRouter> Ye poori routing ko control karta hai.

# BrowserRouter Ka Kaam - Browser ka URL continuously check karta hai.


# App.jsx is the root component of my AceRound application. It manages the application's routing using React Router DOM and wraps the application with AuthProvider to make authentication data available throughout the app. It defines both public routes such as Login and Register, and protected routes such as Home, Dashboard, Interview, and Results. It also handles redirection for invalid routes and controls the overall navigation flow of the application.

# ProtectedRoute ka role kya hai? -- ProtectedRoute is a wrapper component used to secure private routes. It checks whether a user is authenticated using the authentication state from useAuth(). If authentication is still loading, it displays a loader. If the user is logged in, it renders the requested route through Outlet. Otherwise, it redirects the user to the login page using Navigate.

# replace Kya Hai? -- Browser history ko replace karta hai.

# createContext() React me Context API banane ke liye use hota hai.Iska use tab karte hain jab data ko baar-baar props se pass nahi karna ho.


localStorage Kya Hai?
Browser ka chhota storage.
Data save reh sakta hai even browser refresh ke baad.

# children matlab component ke opening aur closing tag ke beech ka content.


# AuthProvider wraps the application and provides authentication state and functions through React Context. It uses useAuthState to manage user data, login, logout, and registration logic, and makes this information available to all child components without prop drilling.