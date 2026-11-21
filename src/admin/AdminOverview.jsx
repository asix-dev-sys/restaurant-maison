import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import api from "../services/api";

const CHANNEL_LABELS = {
  dine_in: "В зале",
  takeaway: "С собой",
  delivery: "Доставка",
};

function formatBishkekDate(dateObj) {
  return dateObj.toLocaleDateString("en-CA", { timeZone: "Asia/Bishkek" }); // YYYY-MM-DD
}

function getDateRangeByPreset(preset) {
  const now = new Date();
  const todayStr = formatBishkekDate(now);

  if (preset === "yesterday") {
    const y = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yStr = formatBishkekDate(y);
    return { date_from: yStr, date_to: yStr };
  }

  if (preset === "week") {
    const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    return { date_from: formatBishkekDate(start), date_to: todayStr };
  }

  return { date_from: todayStr, date_to: todayStr };
}

function formatSom(val) {
  if (val === null || val === undefined || val === "") return "0 сом";
  const num = Number(val);
  if (Number.isNaN(num)) return `${val} сом`;
  return `${num.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} сом`;
}

export default function AdminOverview() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);
  const [channels, setChannels] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const [compare, setCompare] = useState(null);

  const loadReports = useCallback(
    async (preset = timeFilter) => {
      setLoading(true);
      setError("");
      try {
        const params = getDateRangeByPreset(preset);
        const [summaryRes, channelsRes, dishesRes, compareRes] =
          await Promise.all([
            api.get("staff/reports/summary/", { params }),
            api.get("staff/reports/channels/", { params }),
            api.get("staff/reports/popular-dishes/", { params }),
            api.get("staff/reports/compare/", { params }),
          ]);

        setSummary(summaryRes.data || null);
        setChannels(Array.isArray(channelsRes.data) ? channelsRes.data : []);
        setPopularDishes(Array.isArray(dishesRes.data) ? dishesRes.data : []);
        setCompare(compareRes.data || null);
      } catch (err) {
        const status = err.response?.status;
        if (status === 403) {
          setError(
            "Недостаточно прав для просмотра отчётов (доступно только owner и administrator).",
          );
        } else {
          setError(
            err.response?.data?.detail ||
              "Не удалось загрузить данные отчётов. Нажмите «Обновить».",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [timeFilter],
  );

  // Загружаем только при монтировании; далее — только по клику пользователя
  useEffect(() => {
    loadReports("today");
  }, [loadReports]);

  const handleSelectPreset = (preset) => {
    setTimeFilter(preset);
    loadReports(preset);
  };

  const totalChannelOrders = channels.reduce(
    (acc, item) => acc + (Number(item.paid_orders_count) || 0),
    0,
  );

  const percentText =
    compare?.percent_change === null || compare?.percent_change === undefined
      ? "—"
      : `${Number(compare.percent_change) > 0 ? "+" : ""}${compare.percent_change}%`;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-stone-950">
      <AdminSidebar active="overview" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center text-xs">
          <div className="text-stone-500">Бишкек / Ресторан MAISON</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => loadReports(timeFilter)}
              className="px-3 py-1.5 bg-[#FAF8F4] border border-stone-200 rounded-lg hover:border-stone-400 transition disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Обновить"}
            </button>
          </div>
        </header>

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400">
                {formatBishkekDate(new Date())} · Asia/Bishkek
              </p>
              <h1 className="text-3xl font-serif text-stone-900 mt-1">
                Обзор ресторана
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Оплаченные неотменённые заказы по данным сервера.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admin/orders")}
              className="px-5 py-2.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 text-xs uppercase tracking-widest font-medium rounded-xl transition shadow-sm"
            >
              К заказам
            </button>
          </div>

          {/* Переключатели периодов (обновляют данные по клику) */}
          <div className="flex space-x-2 bg-stone-100 p-1.5 rounded-2xl w-fit text-xs font-medium">
            {[
              { id: "today", label: "Сегодня" },
              { id: "yesterday", label: "Вчера" },
              { id: "week", label: "7 дней" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`px-5 py-2 rounded-xl transition ${
                  timeFilter === p.id
                    ? "bg-white shadow-sm text-amber-800"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
              {error}
            </div>
          )}

          {/* Плашки ключевых метрик */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-950 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400">
                  Выручка
                </p>
                <p className="text-3xl font-serif mt-2">
                  {formatSom(summary?.revenue)}
                </p>
              </div>
              <p className="text-[11px] text-emerald-400 mt-4">
                К прошлому периоду: {percentText}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400">
                  Оплачено заказов
                </p>
                <p className="text-3xl font-serif text-stone-900 mt-2">
                  {summary?.paid_orders_count ?? 0}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 mt-4">
                Валюта: {summary?.currency || "KGS"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400">
                  Средний чек
                </p>
                <p className="text-3xl font-serif text-stone-900 mt-2">
                  {formatSom(summary?.average_check)}
                </p>
              </div>
              <p className="text-[11px] text-stone-400 mt-4">
                Предыдущая выручка: {formatSom(compare?.previous_revenue)}
              </p>
            </div>
          </div>

          {/* Каналы и популярные блюда */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="font-serif text-lg text-stone-900 mb-1">
                Источники заказов
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                Оплаченных заказов: {totalChannelOrders}
              </p>

              {channels.length === 0 ? (
                <p className="text-xs text-stone-500 py-6">
                  Нет данных по каналам за выбранный период.
                </p>
              ) : (
                <div className="space-y-4 text-xs">
                  {channels.map((ch) => {
                    const count = Number(ch.paid_orders_count) || 0;
                    const widthPct =
                      totalChannelOrders > 0
                        ? Math.round((count / totalChannelOrders) * 100)
                        : 0;
                    return (
                      <div key={ch.channel}>
                        <div className="flex justify-between mb-1">
                          <span>
                            {CHANNEL_LABELS[ch.channel] || ch.channel}
                          </span>
                          <span className="font-medium">
                            {count} заказов · {formatSom(ch.revenue)}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#D4B273] h-full"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="font-serif text-lg text-stone-900 mb-1">
                Популярные блюда
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                Топ позиций по количеству за период
              </p>

              {popularDishes.length === 0 ? (
                <p className="text-xs text-stone-500 py-6">
                  Нет данных о проданных блюдах за выбранный период.
                </p>
              ) : (
                <div className="divide-y divide-stone-100 text-xs">
                  {popularDishes.map((dish) => (
                    <div
                      key={dish.dish_id ?? dish.dish_name}
                      className="py-3 flex justify-between items-center gap-4"
                    >
                      <span className="font-medium text-stone-900">
                        {dish.dish_name}
                      </span>
                      <span className="font-mono text-stone-600 shrink-0">
                        {dish.quantity} шт.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
