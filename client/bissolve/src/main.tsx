// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App"; // This is your home page
import Signup from "./pages/Signup.tsx"; // Signup page
import "./index.css";
import Home from "./pages/Home"


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
       

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
