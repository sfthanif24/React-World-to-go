import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";

import "./App.css";

// Lazy loading for Performance Optimization
const CountriesPage = lazy(() => import("./pages/CountriesPage"));

const App = () => {
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
              <Route index element={<HomePage />} />
              <Route path="countries" element={<CountriesPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
