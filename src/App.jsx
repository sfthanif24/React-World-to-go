import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import { ChatBot } from "./components/ChatBot/ChatBot";

import "./App.css";

// Lazy loading for Performance Optimization
const CountriesPage = lazy(() => import("./pages/CountriesPage"));

const App = () => {
  useEffect(() => {
    const handlePointerDown = (event) => {
      const wave = document.createElement("span");
      wave.className = "click-wave";
      wave.style.left = `${event.clientX}px`;
      wave.style.top = `${event.clientY}px`;

      document.body.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove(), {
        once: true,
      });
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" />
        <Suspense
          fallback={
            <div
              className="shimmer-loader"
              style={{ textAlign: "center", marginTop: "100px" }}
            >
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<HomePage />} />
              <Route path="countries" element={<CountriesPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/chat" element={<Layout />}>
              <Route index element={<ChatBot forceFullPage={true} />} />
            </Route>
          </Routes>
        </Suspense>
        {/* Global ChatBot FloatingButton - visible on all pages */}
        <ChatBot />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
