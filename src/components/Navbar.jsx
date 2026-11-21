import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ cartItemsCount = 0 }) {
  return (
    <header className="bg-black text-white sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Логотип */}
        <div className="text-xl font-serif tracking-widest uppercase">
          MAISON
        </div>

        {/* Навигационное меню */}
        <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest text-stone-300">
          <Link to="/" className="hover:text-[#D4B273] transition">
            Главная
          </Link>
          <Link to="/menu" className="hover:text-[#D4B273] transition">
            Меню
          </Link>
          <Link to="/about" className="hover:text-[#D4B273] transition">
            О ресторане
          </Link>
          <Link to="/contacts" className="hover:text-[#D4B273] transition">
            Контакты
          </Link>
        </nav>

        {/* Правая часть: Кнопка бронирования и динамическая корзина */}
        <div className="flex items-center space-x-6">
          <Link
            to="/booking"
            className="hidden sm:inline-block px-5 py-2.5 bg-[#D4B273] text-stone-900 text-xs font-medium uppercase tracking-widest rounded hover:bg-[#c4a163] transition"
          >
            Забронировать
          </Link>

          {/* Корзина отображается ТОЛЬКО если в ней больше 0 товаров */}
          {cartItemsCount > 0 && (
            <Link
              to="/cart"
              className="text-xs uppercase tracking-widest text-stone-300 hover:text-[#D4B273] transition flex items-center gap-2"
            >
              <span>Корзина</span>
              <span className="bg-[#D4B273] text-stone-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                {cartItemsCount}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
