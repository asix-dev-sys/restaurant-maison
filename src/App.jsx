import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingWizard from "./components/booking/BookingWizard";
import UserDashboard from "./components/dashboard/UserDashboard";

// Полноценная Главная страница (Landing Page)
function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 1. Hero-баннер (Главный рекламный блок) */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920"
            alt="Restaurant Interior"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <span className="text-amber-400 uppercase tracking-widest text-sm font-semibold mb-4 block">
            Авторская кухня & Атмосфера
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Искусство гастрономии в каждом блюде
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Погрузитесь в незабываемую атмосферу уюта и изысканных вкусов от
            нашего шеф-повара.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking">
              <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition shadow-sm w-full sm:w-auto">
                Забронировать стол
              </button>
            </Link>
            <a
              href="#about"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition flex items-center justify-center"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </section>

      {/* 2. Информационный блок: «О ресторане MAISON» */}
      <section
        id="about"
        className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <span className="text-amber-600 uppercase tracking-wider text-xs font-bold block mb-2">
            О нас
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Традиции вкуса в современном исполнении
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Ресторан MAISON создан для тех, кто ценит безупречное качество
            продуктов, авторскую подачу и уютную атмосферу. Мы отбираем только
            лучшие ингредиенты локальных и зарубежных фермерских хозяйств.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Наша винная карта насчитывает более 150 редких позиций со всего
            мира, идеально дополняющих гастрономические шедевры нашего меню.
          </p>
          <div className="grid grid-cols-3 gap-6 border-t pt-6">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-1">
                7 лет
              </div>
              <div className="text-xs text-gray-500">Успешной работы</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-1">40+</div>
              <div className="text-xs text-gray-500">Блюд от шефа</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-1">150+</div>
              <div className="text-xs text-gray-500">Видов вин</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600"
            alt="Dish"
            className="rounded-2xl shadow-lg mt-8"
          />
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
            alt="Interior"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* 3. Блок: «История & Концепция» */}
      <section
        id="history"
        className="py-24 bg-stone-50 px-6 border-y border-stone-100"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-600 uppercase tracking-widest text-xs font-bold block mb-3">
            Наша философия
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-stone-900">
            История & Концепция
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed mb-6">
            Ресторан MAISON родился из страсти к аутентичным вкусам и
            современной гастрономической эстетике. Мы верим, что еда — это
            искусство, способное объединять людей и создавать памятные моменты.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed">
            Каждый элемент интерьера, от дизайнерской мебели до мягкого
            приглушенного света, пропитан атмосферой уюта, где время замедляет
            свой ход специально для вас.
          </p>
        </div>
      </section>

      {/* 4. Секция «Шеф-повар & Авторские блюда» */}
      <section
        id="chef"
        className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
      >
        <img
          src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
          alt="Chef"
          className="rounded-3xl shadow-xl w-full h-[450px] object-cover"
        />
        <div>
          <span className="text-amber-600 uppercase tracking-wider text-xs font-bold block mb-2">
            Шеф-повар
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Марк Эллиот</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            «Кулинария — это не просто смешивание ингредиентов, это создание
            эмоций. Каждое блюдо в MAISON рассказывает свою историю, объединяя
            классические французские техники и современные гастрономические
            тенденции».
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-amber-600"></div>
            <span className="font-semibold text-gray-900">
              Обладатель престижных международных наград
            </span>
          </div>
        </div>
      </section>

      {/* 5. Блок: «Галерея интерьера» */}
      <section id="gallery" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-600 uppercase tracking-widest text-xs font-bold block mb-2">
              Атмосфера
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Галерея интерьера
            </h2>
            <p className="text-gray-500">
              Загляните в наш зал, где продумана каждая деталь для вашего
              комфорта.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800"
              alt="Interior 1"
              className="rounded-2xl shadow-md h-72 w-full object-cover hover:scale-[1.02] transition duration-300"
            />
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
              alt="Interior 2"
              className="rounded-2xl shadow-md h-72 w-full object-cover hover:scale-[1.02] transition duration-300"
            />
            <img
              src="https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&q=80&w=800"
              alt="Interior 3"
              className="rounded-2xl shadow-md h-72 w-full object-cover hover:scale-[1.02] transition duration-300"
            />
          </div>
        </div>
      </section>

      {/* 6. Интерактивный Футер (Footer) */}
      <footer id="contacts" className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-2xl font-bold tracking-wider text-amber-500 mb-4">
              MAISON
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Ресторан высокой авторской кухни в самом сердце города. Идеальное
              место для ваших романтических вечеров и важных встреч.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">
              Часы работы
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Понедельник — Четверг: 12:00 — 23:00
            </p>
            <p className="text-gray-400 text-sm mb-2">
              Пятница — Суббота: 12:00 — 01:00
            </p>
            <p className="text-gray-400 text-sm">Воскресенье: 12:00 — 23:00</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">
              Контакты
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              📍 ул. Гастрономическая, 15
            </p>
            <p className="text-gray-400 text-sm mb-2">📞 +996 (555) 123-456</p>
            <p className="text-gray-400 text-sm">
              ✉️ reservation@maison.restaurant
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
          © 2026 MAISON Restaurant. Все права защищены.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addBooking = (newBooking) => {
    setBookings((prev) => [{ id: Date.now(), ...newBooking }, ...prev]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
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
              Личный кабинет{" "}
              {bookings.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                  {bookings.length}
                </span>
              )}
            </Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/booking"
              element={<BookingWizard onAddBooking={addBooking} />}
            />
            <Route
              path="/dashboard"
              element={
                <UserDashboard bookings={bookings} favorites={favorites} />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
