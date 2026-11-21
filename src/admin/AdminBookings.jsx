import React, { useEffect, useState, useCallback } from "react";
import AdminSidebar from "./AdminSidebar";
import api from "../services/api";

const STATUS_TABS = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Ожидает" },
  { key: "confirmed", label: "Подтверждена" },
  { key: "arrived", label: "В зале" },
  { key: "completed", label: "Завершена" },
  { key: "cancelled", label: "Отменена" },
];

const STATUS_BADGE = {
  pending: {
    text: "Ожидает",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  confirmed: {
    text: "Подтверждена",
    cls: "bg-stone-900 text-white border-stone-900",
  },
  arrived: {
    text: "В зале",
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  completed: {
    text: "Завершена",
    cls: "bg-stone-100 text-stone-700 border-stone-200",
  },
  cancelled: {
    text: "Отменена",
    cls: "bg-rose-50 text-rose-800 border-rose-200",
  },
};

function getTodayBishkek() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bishkek" });
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem("staff_profile") || "null");
  } catch {
    profile = null;
  }

  const canManage =
    profile?.role === "owner" || profile?.role === "administrator";

  const fetchBookings = useCallback(
    async ({
      nextStatus = statusFilter,
      nextDate = dateFilter,
      nextSearch = searchQuery,
      nextPage = page,
    } = {}) => {
      setLoading(true);
      setError("");
      try {
        const params = { page: nextPage };
        if (nextStatus !== "all") params.status = nextStatus;
        if (nextDate) params.date = nextDate;
        if (nextSearch.trim()) params.search = nextSearch.trim();

        const response = await api.get("staff/reservations/", { params });
        const data = response.data || response;
        const list = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];

        setBookings(list);
        setCount(typeof data?.count === "number" ? data.count : list.length);
        setHasNext(Boolean(data?.next));
        setHasPrev(Boolean(data?.previous));

        setSelectedBooking((prev) => {
          if (!list.length) return null;
          if (prev) {
            const match = list.find((item) => item.id === prev.id);
            if (match) return match;
          }
          return list[0];
        });
      } catch (err) {
        const httpStatus = err.response?.status;
        if (httpStatus === 403) {
          setError("Недостаточно прав для просмотра бронирований.");
        } else if (httpStatus === 404) {
          setError("Список бронирований не найден или недоступен.");
        } else {
          setError(
            err.response?.data?.detail ||
              "Не удалось загрузить бронирования. Нажмите «Обновить»."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, dateFilter, searchQuery, page]
  );

  // Первичная загрузка при открытии экрана; далее — только по действиям пользователя
  useEffect(() => {
    fetchBookings({
      nextStatus: "all",
      nextDate: "",
      nextSearch: "",
      nextPage: 1,
    });
  }, [fetchBookings]);

  const handleStatusChange = (nextStatus) => {
    setStatusFilter(nextStatus);
    setPage(1);
    fetchBookings({
      nextStatus,
      nextDate: dateFilter,
      nextSearch: searchQuery,
      nextPage: 1,
    });
  };

  const handleDateChange = (nextDate) => {
    setDateFilter(nextDate);
    setPage(1);
    fetchBookings({
      nextStatus: statusFilter,
      nextDate,
      nextSearch: searchQuery,
      nextPage: 1,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings({
      nextStatus: statusFilter,
      nextDate: dateFilter,
      nextSearch: searchQuery,
      nextPage: 1,
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;
    setPage(nextPage);
    fetchBookings({
      nextStatus: statusFilter,
      nextDate: dateFilter,
      nextSearch: searchQuery,
      nextPage,
    });
  };

  const handleBookingAction = async (bookingId, endpointAction) => {
    setActionId(bookingId);
    setError("");
    try {
      await api.post(`staff/reservations/${bookingId}/${endpointAction}/`, {});
      await fetchBookings({
        nextStatus: statusFilter,
        nextDate: dateFilter,
        nextSearch: searchQuery,
        nextPage: page,
      });
    } catch (err) {
      const dataErr = err.response?.data;
      const fieldMsg =
        dataErr?.table_id?.[0] || dataErr?.non_field_errors?.[0];
      setError(
        dataErr?.detail ||
          fieldMsg ||
          dataErr?.code ||
          "Не удалось обновить статус брони."
      );
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const totalGuestsInView = bookings.reduce(
    (sum, b) => sum + (Number(b.guests_count) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-stone-950">
      <AdminSidebar active="bookings" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center text-xs">
          <div className="text-stone-500">Бишкек / Ресторан MAISON</div>
          <div className="flex items-center gap-3">
            <span className="text-stone-500 font-mono">
              {getTodayBishkek()}
            </span>
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                fetchBookings({
                  nextStatus: statusFilter,
                  nextDate: dateFilter,
                  nextSearch: searchQuery,
                  nextPage: page,
                })
              }
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
                Asia/Bishkek · {dateFilter || "Все даты"}
              </p>
              <h1 className="text-3xl font-serif text-stone-900 mt-1">
                Бронирования
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                {canManage
                  ? "Управление заявками гостей, подтверждение и отметка прибытия."
                  : "Просмотр назначенных вам бронирований."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateChange(e.target.value)}
                className="px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => handleDateChange("")}
                  className="px-3 py-2 text-xs text-stone-500 hover:text-stone-900"
                >
                  Сбросить дату
                </button>
              )}
            </div>
          </div>

          {/* Плашки сводки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-950 text-white p-6 rounded-3xl shadow-sm">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Всего записей
              </p>
              <p className="text-3xl font-serif mt-2">{count}</p>
              <p className="text-[11px] text-stone-400 mt-4">
                Гостей на странице: {totalGuestsInView}
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Ожидают подтверждения
              </p>
              <p className="text-3xl font-serif text-stone-900 mt-2">
                {pendingCount}
              </p>
              <p className="text-[11px] text-stone-500 mt-4">
                На текущей странице
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Выбранная бронь
              </p>
              <p className="text-3xl font-serif text-stone-900 mt-2">
                {selectedBooking?.start_time || "—"}
              </p>
              <p className="text-[11px] text-stone-500 mt-4 truncate">
                {selectedBooking
                  ? `${selectedBooking.guest_name} · ${selectedBooking.guests_count} гостей`
                  : "Нет выбранной записи"}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
              {error}
            </div>
          )}

          {/* Поиск, фильтры и список */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-6">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по имени, телефону или номеру брони..."
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-950 text-white text-xs uppercase tracking-widest rounded-xl hover:bg-stone-800 transition"
                >
                  Найти
                </button>
              </form>

              <div className="flex flex-wrap gap-2 text-xs">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleStatusChange(tab.key)}
                    className={`px-3.5 py-2 rounded-xl transition ${
                      statusFilter === tab.key
                        ? "bg-amber-50 text-amber-900 font-medium border border-amber-200"
                        : "text-stone-500 hover:text-stone-900 border border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {bookings.length === 0 && !loading ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  Бронирований по выбранным параметрам нет.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-stone-400 uppercase tracking-wider border-b border-stone-100">
                        <th className="pb-3">Дата / Время</th>
                        <th className="pb-3">Гость</th>
                        <th className="pb-3">Гости / Стол</th>
                        <th className="pb-3">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bookings.map((b) => {
                        const badge = STATUS_BADGE[b.status] || {
                          text: b.status || "—",
                          cls: "bg-stone-100 text-stone-700 border-stone-200",
                        };
                        const isSelected = selectedBooking?.id === b.id;

                        return (
                          <tr
                            key={b.id}
                            onClick={() => setSelectedBooking(b)}
                            className={`hover:bg-amber-50/40 cursor-pointer transition ${
                              isSelected ? "bg-amber-50/60" : ""
                            }`}
                          >
                            <td className="py-4 font-mono text-stone-900 whitespace-nowrap">
                              <div>{b.date}</div>
                              <div className="text-stone-500">
                                {b.start_time}
                                {b.end_time ? `–${b.end_time}` : ""}
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="font-medium text-stone-900">
                                {b.guest_name}
                              </p>
                              <p className="text-stone-400">
                                {b.reservation_number}
                                {b.phone ? ` · ${b.phone}` : ""}
                              </p>
                            </td>
                            <td className="py-4 text-stone-600 whitespace-nowrap">
                              {b.guests_count} гостей ·{" "}
                              {b.table?.code || "Стол не назначен"}
                            </td>
                            <td className="py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-medium border ${badge.cls}`}
                              >
                                {badge.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {(hasPrev || hasNext) && (
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <button
                    type="button"
                    disabled={!hasPrev || loading}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-2 border border-stone-200 rounded-xl disabled:opacity-40 hover:border-stone-400"
                  >
                    ← Назад
                  </button>
                  <span>Страница {page}</span>
                  <button
                    type="button"
                    disabled={!hasNext || loading}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 border border-stone-200 rounded-xl disabled:opacity-40 hover:border-stone-400"
                  >
                    Вперёд →
                  </button>
                </div>
              )}
            </div>

            {/* Карточка выбранной брони и доступные по роли действия */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-5">
              {selectedBooking ? (
                <>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-stone-400">
                      {selectedBooking.reservation_number || `#${selectedBooking.id}`}
                    </span>
                    <h2 className="font-serif text-2xl text-stone-900 mt-1">
                      {selectedBooking.guest_name}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Статус с сервера: {selectedBooking.status}
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs border-y border-stone-100 py-4">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Дата</span>
                      <span className="font-mono font-medium">
                        {selectedBooking.date || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Время</span>
                      <span className="font-mono font-medium">
                        {selectedBooking.start_time || "—"}
                        {selectedBooking.end_time
                          ? ` – ${selectedBooking.end_time}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Гостей</span>
                      <span className="font-medium">
                        {selectedBooking.guests_count ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Стол</span>
                      <span className="font-medium">
                        {selectedBooking.table?.code || "Не назначен"}
                      </span>
                    </div>
                    {selectedBooking.phone && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Телефон</span>
                        <span className="font-mono">
                          {selectedBooking.phone}
                        </span>
                      </div>
                    )}
                    {selectedBooking.source && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Источник</span>
                        <span>{selectedBooking.source}</span>
                      </div>
                    )}
                  </div>

                  {canManage && (
                    <div className="space-y-2.5">
                      {selectedBooking.status === "pending" && (
                        <button
                          type="button"
                          disabled={actionId === selectedBooking.id}
                          onClick={() =>
                            handleBookingAction(selectedBooking.id, "confirm")
                          }
                          className="w-full py-3 bg-[#D4B273] hover:bg-[#c4a163] text-stone-950 text-xs uppercase tracking-widest font-medium rounded-xl transition disabled:opacity-50"
                        >
                          {actionId === selectedBooking.id
                            ? "Выполнение..."
                            : "Подтвердить бронь"}
                        </button>
                      )}

                      {selectedBooking.status === "confirmed" && (
                        <button
                          type="button"
                          disabled={actionId === selectedBooking.id}
                          onClick={() =>
                            handleBookingAction(selectedBooking.id, "arrive")
                          }
                          className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-medium rounded-xl transition disabled:opacity-50"
                        >
                          {actionId === selectedBooking.id
                            ? "Выполнение..."
                            : "Отметить прибытие"}
                        </button>
                      )}

                      {(selectedBooking.status === "pending" ||
                        selectedBooking.status === "confirmed") && (
                        <button
                          type="button"
                          disabled={actionId === selectedBooking.id}
                          onClick={() =>
                            handleBookingAction(selectedBooking.id, "cancel")
                          }
                          className="w-full py-2.5 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs uppercase tracking-widest rounded-xl transition disabled:opacity-50"
                        >
                          Отменить бронь
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-stone-400 text-center py-8">
                  Выберите бронирование из списка
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}