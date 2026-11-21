import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const ROLE_LABELS = {
  owner: "Владелец",
  administrator: "Администратор",
  waiter: "Официант",
  chef: "Шеф-повар",
};

export default function AdminSidebar({ active, shiftStatus }) {
  const navigate = useNavigate();

  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem("staff_profile") || "null");
  } catch {
    profile = null;
  }

  const role = profile?.role || "administrator";
  const canSeeReports = role === "owner" || role === "administrator";
  const canSeeHallAndOrders =
    role === "owner" || role === "administrator" || role === "waiter";

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        await api.post("staff/auth/logout/", { refresh });
      }
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("staff_profile");
      navigate("/staff/login", { replace: true });
    }
  };

  return (
    <aside className="w-72 bg-stone-950 text-white flex flex-col justify-between p-6 border-r border-stone-900 shrink-0">
      <div>
        <div className="mb-10">
          <h2 className="font-serif text-xl tracking-wide">MAISON</h2>
          <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
            Управление рестораном
          </p>
        </div>

        <nav className="space-y-2 text-sm font-medium">
          {canSeeReports && (
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                active === "overview"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <span>📊</span>
              <span>Обзор</span>
            </Link>
          )}

          {canSeeHallAndOrders && (
            <>
              <Link
                to="/admin/bookings"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  active === "bookings"
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <span>📅</span>
                <span>Бронирования</span>
              </Link>

              <Link
                to="/admin/hall"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  active === "hall"
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <span>🪑</span>
                <span>План зала</span>
              </Link>

              <Link
                to="/admin/orders"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  active === "orders"
                    ? "bg-stone-800 text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <span>📋</span>
                <span>Заказы</span>
              </Link>
            </>
          )}

          {(role === "owner" ||
            role === "administrator" ||
            role === "chef") && (
            <Link
              to="/staff/kitchen"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                active === "kitchen"
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <span>🍳</span>
              <span>Кухня</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-stone-900 text-xs">
        <div>
          <p className="text-stone-400">Статус смены</p>
          <p className="font-mono font-medium text-stone-300 mt-0.5">
            {shiftStatus === "open"
              ? "Смена открыта"
              : shiftStatus === "closed"
                ? "Смена закрыта"
                : "По данным сервера"}
          </p>
        </div>

        <div className="flex justify-between items-center bg-stone-900/60 p-3 rounded-xl gap-2">
          <div className="min-w-0">
            <p className="font-medium text-stone-200 truncate">
              {profile?.full_name || "Сотрудник"}
            </p>
            <p className="text-[11px] text-stone-500">
              {ROLE_LABELS[role] || role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-stone-400 hover:text-rose-400 transition shrink-0"
            title="Выйти"
          >
            Выйти ↗
          </button>
        </div>
      </div>
    </aside>
  );
}
