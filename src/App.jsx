import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingWizard from "./components/booking/BookingWizard";
import UserDashboard from "./components/dashboard/UserDashboard";

function Home() {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-4xl font-bold tracking-wider mb-4 text-gray-900">
        RESTAURANT MAISON
      </h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Добро пожаловать в модуль бронирования столов и личного кабинета.
      </p>
      <Link
        to="/booking"
        className="px-8 py-3.5 bg-amber-600 text-white font-medium rounded-xl shadow-lg hover:bg-amber-700 transition"
      >
        Забронировать столик
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Шапка сайта */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link
            to="/"
            className="text-xl font-bold tracking-widest text-amber-600"
          >
            MAISON
          </Link>
          <nav className="space-x-8 font-medium">
            <Link to="/" className="hover:text-amber-600 transition">
              Главная
            </Link>
            <Link to="/booking" className="hover:text-amber-600 transition">
              Бронирование
            </Link>
            <Link to="/dashboard" className="hover:text-amber-600 transition">
              Личный кабинет
            </Link>
          </nav>
        </header>

        {/* Основной контент */}
        <main className="py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<BookingWizard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
