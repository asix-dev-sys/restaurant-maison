import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import PublicBooking from "./components/booking/PublicBooking";
import StaffLogin from "./admin/StaffLogin";
import AdminOverview from "./admin/AdminOverview";
import AdminBookings from "./admin/AdminBookings";
import AdminHallPlan from "./admin/AdminHallPlan";
import AdminOrders from "./admin/AdminOrders";
import KitchenQueue from "./admin/KitchenQueue";

function getStoredStaffSession() {
  const token = localStorage.getItem("access_token");
  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem("staff_profile") || "null");
  } catch {
    profile = null;
  }
  return { token, profile };
}

function getDefaultStaffRoute(role) {
  if (role === "chef") return "/staff/kitchen";
  if (role === "waiter") return "/admin/orders";
  return "/admin/dashboard";
}

function RequireStaffRole({ allowedRoles, children }) {
  const { token, profile } = getStoredStaffSession();
  const role = profile?.role;

  if (!token) {
    return <Navigate to="/staff/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultStaffRoute(role)} replace />;
  }

  return children;
}

function StaffDashboardRedirect() {
  const { token, profile } = getStoredStaffSession();
  if (!token) {
    return <Navigate to="/staff/login" replace />;
  }
  return <Navigate to={getDefaultStaffRoute(profile?.role)} replace />;
}

function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans selection:bg-[#C5A880] selection:text-white">
      <section className="relative min-h-screen flex flex-col justify-between text-white px-8 md:px-16 py-8 overflow-hidden bg-[#121614]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920"
            alt="Ресторан Maison"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121614] via-[#121614]/60 to-[#121614]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col items-start">
            <span
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-2xl md:text-[26px] tracking-[0.2em] leading-none font-normal"
            >
              MAISON
            </span>
            <span className="text-[8px] uppercase tracking-[0.38em] text-[#C5A880] mt-1">
              RESTAURANT
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-10 text-xs tracking-[0.12em] text-[#E0DCD0] font-medium">
            <a href="#" className="hover:text-white transition">
              Главная
            </a>
            <a href="#menu-preview" className="hover:text-white transition">
              Меню
            </a>
            <a href="#about" className="hover:text-white transition">
              О ресторане
            </a>
            <a href="#contacts" className="hover:text-white transition">
              Контакты
            </a>
            <Link
              to="/staff/login"
              className="text-[#C5A880] hover:text-white transition"
            >
              Персонал
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/booking"
              className="group px-6 py-3 bg-[#C5A880] hover:bg-[#b0936b] text-[#121614] text-xs uppercase tracking-[0.12em] transition-all duration-300 inline-flex items-center gap-2 font-medium"
            >
              <span>Забронировать</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[#C5A880]" />
            <span className="text-[#C5A880] uppercase tracking-[0.25em] text-[11px] font-medium">
              Ресторан авторской кухни
            </span>
          </div>

          <h1
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-5xl sm:text-6xl md:text-[76px] font-normal leading-[1.08] text-white mb-6 max-w-4xl"
          >
            Искусство вкуса{" "}
            <span className="italic font-normal text-[#D4C3A3]">
              в каждой детали
            </span>
          </h1>

          <p className="text-[#C2BCB0] font-light text-base md:text-lg max-w-lg mb-10 leading-relaxed">
            Место, где время замедляется, а каждый ужин становится особенным.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#menu-preview"
              className="px-7 py-4 bg-[#C5A880] hover:bg-[#b0936b] text-[#121614] text-xs uppercase tracking-[0.2em] font-medium transition inline-flex items-center gap-2"
            >
              <span>Наше меню</span>
              <span>↗</span>
            </a>
            <Link
              to="/booking"
              className="px-7 py-4 border border-white/30 hover:border-white text-white text-xs uppercase tracking-[0.2em] font-medium transition inline-flex items-center gap-2"
            >
              <span>Забронировать стол</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center text-xs text-[#A39E93] tracking-widest">
          <div className="flex items-center gap-2">
            <span>ЛИСТАЙТЕ ВНИЗ</span>
            <span className="animate-bounce">↓</span>
          </div>
          <div>ВЕЧЕРА, КОТОРЫЕ ХОЧЕТСЯ ЗАПОМНИТЬ</div>
          <div>01 / 03</div>
        </div>
      </section>

      <section
        id="menu-preview"
        className="py-24 px-8 md:px-16 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[#C5A880]" />
              <span className="text-[#8C7A6B] uppercase tracking-[0.25em] text-[11px] font-medium">
                Добро пожаловать в Maison
              </span>
            </div>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-5xl md:text-[62px] font-normal leading-[1.08] text-[#1A1A1A] mb-6"
            >
              Вкус, который <span className="italic">остаётся с вами.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 pt-4">
            <p className="text-[#6B655D] font-light text-base leading-relaxed mb-6">
              MAISON — это пространство для неспешных встреч, красивых моментов
              и кухни, в которой каждая деталь имеет значение.
            </p>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#C5A880] transition font-medium"
            >
              <span>Узнать о нас</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white border border-[#E6E2D8] shadow-sm flex flex-col">
            <div className="relative h-72 overflow-hidden bg-[#F0EDE6]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
                alt="Филе миньон"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[10px] tracking-wider px-3 py-1 uppercase">
                Хит
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h4
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                    className="text-2xl text-[#1A1A1A]"
                  >
                    Филе миньон
                  </h4>
                  <span className="text-sm font-semibold">1 890 сом</span>
                </div>
                <p className="text-[#7F7A71] text-xs font-light mb-6">
                  Картофельный гратен, соус из сморчков
                </p>
              </div>
              <Link
                to="/booking"
                className="w-full py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-[0.15em] transition text-center"
              >
                Забронировать стол
              </Link>
            </div>
          </div>

          <div className="group bg-white border border-[#E6E2D8] shadow-sm flex flex-col">
            <div className="relative h-72 overflow-hidden bg-[#F0EDE6]">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800"
                alt="Тартар из говядины"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[10px] tracking-wider px-3 py-1 uppercase">
                Шеф рекомендует
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h4
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                    className="text-2xl text-[#1A1A1A]"
                  >
                    Тартар из говядины
                  </h4>
                  <span className="text-sm font-semibold">980 сом</span>
                </div>
                <p className="text-[#7F7A71] text-xs font-light mb-6">
                  Каперсы, пармезан, хрустящий бриошь
                </p>
              </div>
              <Link
                to="/booking"
                className="w-full py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-[0.15em] transition text-center"
              >
                Забронировать стол
              </Link>
            </div>
          </div>

          <div className="group bg-white border border-[#E6E2D8] shadow-sm flex flex-col">
            <div className="relative h-72 overflow-hidden bg-[#F0EDE6]">
              <img
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800"
                alt="Лосось на гриле"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <h4
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                    className="text-2xl text-[#1A1A1A]"
                  >
                    Лосось на гриле
                  </h4>
                  <span className="text-sm font-semibold">1 590 сом</span>
                </div>
                <p className="text-[#7F7A71] text-xs font-light mb-6">
                  Крем из сельдерея, сезонная зелень
                </p>
              </div>
              <Link
                to="/booking"
                className="w-full py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs uppercase tracking-[0.15em] transition text-center"
              >
                Забронировать стол
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] bg-[#141A16]"
      >
        <div className="relative min-h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000"
            alt="Шеф-повар на кухне"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-10 lg:px-20 py-20 text-white">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-[#C5A880]" />
            <span className="text-[#C5A880] uppercase tracking-[0.25em] text-[11px] font-medium">
              От нашего шефа
            </span>
          </div>
          <h3
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-4xl md:text-5xl font-normal leading-[1.15] mb-6"
          >
            Вдохновение{" "}
            <span className="italic text-[#D4C3A3]">в каждом блюде.</span>
          </h3>
          <p className="text-[#C2BCB0] font-light text-base leading-relaxed mb-8 max-w-lg">
            Мы верим в силу простых ингредиентов, безупречного мастерства и
            вкуса, который говорит сам за себя.
          </p>
          <div>
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 px-7 py-4 border border-white/30 hover:border-white text-xs uppercase tracking-[0.2em] font-medium transition"
            >
              <span>Забронировать стол</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <footer
        id="contacts"
        className="bg-[#121614] text-white pt-20 pb-12 px-8 md:px-16 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-2xl tracking-[0.2em] mb-2"
            >
              MAISON
            </h4>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C5A880] block mb-6">
              RESTAURANT
            </span>
            <p className="text-xs text-[#A39E93] font-light">
              Искусство вкуса в каждой детали.
            </p>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Навигация
            </h5>
            <ul className="space-y-2 text-xs text-[#C2BCB0]">
              <li>
                <a href="#" className="hover:text-white transition">
                  Главная
                </a>
              </li>
              <li>
                <a href="#menu-preview" className="hover:text-white transition">
                  Меню
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition">
                  О ресторане
                </a>
              </li>
              <li>
                <Link
                  to="/staff/login"
                  className="text-[#C5A880] hover:text-white transition"
                >
                  Панель персонала
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Свяжитесь с нами
            </h5>
            <p className="text-xs text-[#C2BCB0] mb-2">Бишкек, Кыргызстан</p>
            <p className="text-xs text-[#C2BCB0]">Ежедневно - 12:00-23:00</p>
          </div>

          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-4">
              Особенный вечер
            </h5>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white hover:text-[#C5A880] transition font-medium"
            >
              <span>Забронировать</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-[#7A756B]">
          <div>© 2026 MAISON RESTAURANT</div>
          <div>Создано с любовью к деталям</div>
        </div>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 bg-[#F7F5F0]/90 backdrop-blur-md border-b border-[#E6E2D8] z-50 px-8 md:px-16 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex flex-col items-start group">
          <span
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            className="text-2xl tracking-[0.2em] text-[#1A1A1A] leading-none"
          >
            MAISON
          </span>
          <span className="text-[8px] uppercase tracking-[0.38em] text-[#8C7A6B] mt-1">
            RESTAURANT
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/staff/login"
            className="text-xs uppercase tracking-[0.12em] text-[#8C7A6B] hover:text-[#1A1A1A] transition"
          >
            Персонал
          </Link>
          <Link
            to="/booking"
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs uppercase tracking-[0.12em] transition"
          >
            Забронировать ↗
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/booking"
          element={
            <>
              <Header />
              <PublicBooking />
            </>
          }
        />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboardRedirect />} />

        <Route
          path="/admin/dashboard"
          element={
            <RequireStaffRole allowedRoles={["owner", "administrator"]}>
              <AdminOverview />
            </RequireStaffRole>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <RequireStaffRole
              allowedRoles={["owner", "administrator", "waiter"]}
            >
              <AdminBookings />
            </RequireStaffRole>
          }
        />
        <Route
          path="/admin/hall"
          element={
            <RequireStaffRole
              allowedRoles={["owner", "administrator", "waiter"]}
            >
              <AdminHallPlan />
            </RequireStaffRole>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RequireStaffRole
              allowedRoles={["owner", "administrator", "waiter"]}
            >
              <AdminOrders />
            </RequireStaffRole>
          }
        />
        <Route
          path="/staff/kitchen"
          element={
            <RequireStaffRole allowedRoles={["owner", "administrator", "chef"]}>
              <KitchenQueue />
            </RequireStaffRole>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
