import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../services/api";

const STATUS_TABS = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "preparing", label: "Готовятся" },
  { key: "ready", label: "Готовы" },
];

const STATION_TABS = [
  { key: "all", label: "Все цеха" },
  { key: "hot", label: "Горячий цех" },
  { key: "cold", label: "Холодный цех" },
];

const STATUS_BADGE = {
  new: { text: "Новый", cls: "bg-amber-100 text-amber-900 border-amber-300" },
  preparing: {
    text: "Готовится",
    cls: "bg-stone-900 text-white border-stone-900",
  },
  ready: {
    text: "Готов",
    cls: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
};

export default function KitchenQueue() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionOrderId, setActionOrderId] = useState(null);
  const [error, setError] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState("");

  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("staff_profile") || "null");
    } catch {
      return null;
    }
  })();

  const hasAdminSidebar =
    profile?.role === "owner" || profile?.role === "administrator";

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        await api.post("staff/auth/logout/", { refresh });
      }
    } catch {
      // Игнорируем ошибку при выходе
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("staff_profile");
      navigate("/staff/login", { replace: true });
    }
  };

  const fetchKitchenOrders = useCallback(
    async (nextStatus = statusFilter, nextStation = stationFilter) => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (nextStatus !== "all") params.status = nextStatus;
        if (nextStation !== "all") params.station = nextStation;

        const response = await api.get("staff/kitchen/orders/", { params });
        const data = response.data || response;
        const list = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];

        setOrders(list);
        const now = new Date();
        setLastSyncTime(
          now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) {
          setError("Недостаточно прав для просмотра кухонной очереди.");
        } else if (status === 404) {
          setError("Кухонная очередь не найдена или недоступна.");
        } else {
          setError(
            err.response?.data?.detail ||
              "Не удалось загрузить заказы кухни. Нажмите «Обновить».",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, stationFilter],
  );

  useEffect(() => {
    fetchKitchenOrders("all", "all");
  }, [fetchKitchenOrders]);

  const handleSelectStatus = (nextStatus) => {
    setStatusFilter(nextStatus);
    fetchKitchenOrders(nextStatus, stationFilter);
  };

  const handleSelectStation = (nextStation) => {
    setStationFilter(nextStation);
    fetchKitchenOrders(statusFilter, nextStation);
  };

  const handleStatusChange = async (orderId, actionEndpoint) => {
    setActionOrderId(orderId);
    setError("");
    try {
      await api.post(`staff/orders/${orderId}/${actionEndpoint}/`, {});
      await fetchKitchenOrders(statusFilter, stationFilter);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("Недостаточно прав для изменения статуса заказа.");
      } else {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.code ||
            "Не удалось обновить статус заказа.",
        );
      }
    } finally {
      setActionOrderId(null);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bishkek",
    });
  };

  const newOrders = orders.filter((o) => o.status === "new");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");

  const renderOrderCard = (order) => {
    const badge = STATUS_BADGE[order.status] || {
      text: order.status || "—",
      cls: "bg-stone-100 text-stone-700 border-stone-200",
    };
    const isBusy = actionOrderId === order.id;

    return (
      <div
        key={order.id}
        className="bg-white border border-[#E6E2D8] rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4"
      >
        <div>
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#F0EDE6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-medium text-[#1A1A1A]">
                  {order.number || `#${order.id}`}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${badge.cls}`}
                >
                  {badge.text}
                </span>
              </div>
              <div className="text-xs text-[#6B655D] mt-1">
                {order.table_code
                  ? `Стол ${order.table_code}`
                  : order.channel || "Заказ"}
                {order.created_at ? ` · ${formatTime(order.created_at)}` : ""}
              </div>
            </div>
          </div>

          <ul className="mt-3 space-y-2.5">
            {(order.items || []).map((item, idx) => (
              <li
                key={item.id ?? `${order.id}-${idx}`}
                className="bg-[#FAF8F4] border border-[#EFECE4] rounded-lg px-3 py-2"
              >
                <div className="flex justify-between items-baseline gap-2 text-sm text-[#1A1A1A]">
                  <span className="font-medium">
                    {item.quantity} × {item.dish_name}
                  </span>
                  {item.station && (
                    <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B]">
                      {item.station === "hot"
                        ? "Горячий"
                        : item.station === "cold"
                          ? "Холодный"
                          : item.station}
                    </span>
                  )}
                </div>
                {item.note && (
                  <p className="text-xs text-[#6B655D] mt-1">
                    Комментарий: {item.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          {order.status === "new" && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleStatusChange(order.id, "preparing")}
              className="w-full py-2.5 px-4 bg-[#C5A880] hover:bg-[#b39469] text-[#121614] text-xs uppercase tracking-widest font-medium rounded-lg transition disabled:opacity-50"
            >
              {isBusy ? "Обновление..." : "Начать приготовление"}
            </button>
          )}

          {order.status === "preparing" && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleStatusChange(order.id, "ready")}
              className="w-full py-2.5 px-4 bg-[#121614] hover:bg-[#262e2a] text-white text-xs uppercase tracking-widest font-medium rounded-lg transition disabled:opacity-50"
            >
              {isBusy ? "Обновление..." : "Отметить готовым"}
            </button>
          )}

          {order.status === "ready" && (
            <div className="text-center text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg py-2">
              Ожидает выдачи официанту
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] flex font-sans">
      {hasAdminSidebar ? (
        <AdminSidebar active="kitchen" />
      ) : (
        <aside className="w-72 bg-stone-950 text-white flex flex-col justify-between p-6 border-r border-stone-900 shrink-0">
          <div>
            <h2 className="font-serif text-xl tracking-wide">MAISON</h2>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
              Управление рестораном
            </p>
            <div className="mt-8 px-4 py-3 rounded-xl bg-stone-800 text-sm font-medium">
              🍳 Кухня
            </div>
          </div>

          <div className="flex justify-between items-center bg-stone-900/60 p-3 rounded-xl text-xs gap-2">
            <div className="min-w-0">
              <p className="font-medium text-stone-200 truncate">
                {profile?.full_name || "Повар"}
              </p>
              <p className="text-[11px] text-stone-500">
                {profile?.role || "chef"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-stone-400 hover:text-rose-400 transition shrink-0"
            >
              Выйти ↗
            </button>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E6E2D8] px-8 py-4 flex justify-between items-center text-xs">
          <div className="text-[#6B655D]">Бишкек / Ресторан MAISON · Кухня</div>
          <div className="flex items-center gap-3">
            {lastSyncTime && (
              <span className="text-[#6B655D]">Обновлено в {lastSyncTime}</span>
            )}
            <button
              type="button"
              disabled={loading}
              onClick={() => fetchKitchenOrders(statusFilter, stationFilter)}
              className="px-4 py-2 bg-[#121614] hover:bg-[#262e2a] text-white text-xs uppercase tracking-widest rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Обновить"}
            </button>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          <div className="mb-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7A6B] block mb-1">
              MAISON · Кухня
            </span>
            <h1
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              className="text-4xl md:text-5xl font-normal"
            >
              Кухонная очередь
            </h1>
            {profile?.full_name && (
              <p className="text-xs text-[#6B655D] mt-1">
                {profile.full_name} · {profile.role}
              </p>
            )}
          </div>

          <div className="bg-white border border-[#E6E2D8] rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {STATION_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleSelectStation(tab.key)}
                  className={`px-3.5 py-2 text-xs rounded-lg border transition ${
                    stationFilter === tab.key
                      ? "bg-[#121614] text-white border-[#121614]"
                      : "bg-[#FAF8F4] text-[#4A453E] border-[#E6E2D8] hover:border-[#C5A880]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleSelectStatus(tab.key)}
                  className={`px-3.5 py-2 text-xs rounded-lg border transition ${
                    statusFilter === tab.key
                      ? "bg-[#C5A880] text-[#121614] border-[#C5A880] font-medium"
                      : "bg-[#FAF8F4] text-[#4A453E] border-[#E6E2D8] hover:border-[#C5A880]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center justify-between gap-4">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => fetchKitchenOrders(statusFilter, stationFilter)}
                className="underline font-medium shrink-0"
              >
                Повторить
              </button>
            </div>
          )}

          {!loading && orders.length === 0 && !error ? (
            <div className="bg-white border border-[#E6E2D8] rounded-xl p-12 text-center text-sm text-[#6B655D]">
              Заказов по выбранным параметрам нет.
            </div>
          ) : statusFilter === "all" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs uppercase tracking-widest text-[#6B655D] font-medium">
                    Новые
                  </h2>
                  <span className="text-xs text-[#6B655D]">
                    {newOrders.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {newOrders.length ? (
                    newOrders.map(renderOrderCard)
                  ) : (
                    <div className="bg-white/70 border border-dashed border-[#DFDBD0] rounded-xl p-6 text-center text-xs text-[#8C7A6B]">
                      Новых заказов нет
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs uppercase tracking-widest text-[#6B655D] font-medium">
                    Готовятся
                  </h2>
                  <span className="text-xs text-[#6B655D]">
                    {preparingOrders.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {preparingOrders.length ? (
                    preparingOrders.map(renderOrderCard)
                  ) : (
                    <div className="bg-white/70 border border-dashed border-[#DFDBD0] rounded-xl p-6 text-center text-xs text-[#8C7A6B]">
                      В работе сейчас пусто
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs uppercase tracking-widest text-[#6B655D] font-medium">
                    Готовы
                  </h2>
                  <span className="text-xs text-[#6B655D]">
                    {readyOrders.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {readyOrders.length ? (
                    readyOrders.map(renderOrderCard)
                  ) : (
                    <div className="bg-white/70 border border-dashed border-[#DFDBD0] rounded-xl p-6 text-center text-xs text-[#8C7A6B]">
                      Готовых заказов пока нет
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {orders.map(renderOrderCard)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
