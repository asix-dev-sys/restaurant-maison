import React, { useEffect, useState, useCallback } from "react";
import AdminSidebar from "./AdminSidebar";
import api from "../services/api";

const STATUS_LABELS = {
  free: "Свободен",
  reserved: "Забронирован",
  occupied: "Занят",
};

function getTodayBishkekDate() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bishkek" });
}

function getCurrentBishkekTime() {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Bishkek",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminHallPlan() {
  const [date, setDate] = useState(getTodayBishkekDate);
  const [time, setTime] = useState(getCurrentBishkekTime);
  const [durationMinutes, setDurationMinutes] = useState(120);

  const [tables, setTables] = useState([]);
  const [zones, setZones] = useState(["all"]);
  const [activeZone, setActiveZone] = useState("all");
  const [selectedTableId, setSelectedTableId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem("staff_profile") || "null");
  } catch {
    profile = null;
  }

  const canManage =
    profile?.role === "owner" || profile?.role === "administrator";

  const fetchHallPlan = useCallback(
    async ({
      nextDate = date,
      nextTime = time,
      nextDuration = durationMinutes,
    } = {}) => {
      setLoading(true);
      setError("");
      setInfoMsg("");

      try {
        const params = {
          date: nextDate,
          time: nextTime,
          duration_minutes: Number(nextDuration) || 120,
        };

        const response = await api.get("staff/tables/", { params });
        const data = response.data || response;
        const list = Array.isArray(data?.tables)
          ? data.tables
          : Array.isArray(data)
            ? data
            : [];

        setTables(list);

        const uniqueZones = Array.from(
          new Set(list.map((t) => t.zone).filter(Boolean)),
        );
        const nextZones = ["all", ...uniqueZones];
        setZones(nextZones);

        setSelectedTableId((prevId) => {
          if (!list.length) return null;
          if (prevId && list.some((t) => t.id === prevId)) return prevId;
          return list[0].id;
        });
      } catch (err) {
        const httpStatus = err.response?.status;
        if (httpStatus === 403) {
          setError("Недостаточно прав для просмотра плана зала.");
        } else if (httpStatus === 404) {
          setError("План зала не найден или недоступен.");
        } else {
          setError(
            err.response?.data?.detail ||
              "Не удалось загрузить план зала. Нажмите «Обновить».",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [date, time, durationMinutes],
  );

  // Первичная загрузка при открытии; далее — только по действию пользователя
  useEffect(() => {
    fetchHallPlan({
      nextDate: date,
      nextTime: time,
      nextDuration: durationMinutes,
    });
  }, [fetchHallPlan]);

  const handleApplyParams = (e) => {
    e.preventDefault();
    fetchHallPlan({
      nextDate: date,
      nextTime: time,
      nextDuration: durationMinutes,
    });
  };

  const handleArriveGuest = async (reservationId) => {
    if (!reservationId) return;
    setActionBusy(true);
    setError("");
    setInfoMsg("");
    try {
      await api.post(`staff/reservations/${reservationId}/arrive/`, {});
      setInfoMsg("Прибытие гостя отмечено.");
      await fetchHallPlan({
        nextDate: date,
        nextTime: time,
        nextDuration: durationMinutes,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.code ||
          "Не удалось отметить прибытие гостя.",
      );
    } finally {
      setActionBusy(false);
    }
  };

  const visibleTables =
    activeZone === "all" ? tables : tables.filter((t) => t.zone === activeZone);

  const selectedTable =
    tables.find((t) => t.id === selectedTableId) || visibleTables[0] || null;

  const freeCount = tables.filter((t) => t.status === "free").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-stone-950">
      <AdminSidebar active="hall" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center text-xs">
          <div className="text-stone-500">Бишкек / Ресторан MAISON</div>
          <div className="flex items-center gap-3">
            <span className="text-stone-500 font-mono">
              {date} · {time}
            </span>
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                fetchHallPlan({
                  nextDate: date,
                  nextTime: time,
                  nextDuration: durationMinutes,
                })
              }
              className="px-3 py-1.5 bg-[#FAF8F4] border border-stone-200 rounded-lg hover:border-stone-400 transition disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Обновить"}
            </button>
          </div>
        </header>

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Asia/Bishkek · Столов: {tables.length}
              </p>
              <h1 className="text-3xl font-serif text-stone-900 mt-1">
                План зала
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Свободно: {freeCount} · Забронировано: {reservedCount} · Занято:{" "}
                {occupiedCount}
              </p>
            </div>

            <form
              onSubmit={handleApplyParams}
              className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-stone-200 text-xs"
            >
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-amber-600"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-amber-600"
              />
              <input
                type="number"
                min={15}
                max={480}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                title="Длительность (мин)"
                className="w-20 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-amber-600 font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-950 font-medium rounded-lg transition disabled:opacity-50"
              >
                Показать
              </button>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl">
              {infoMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Схема столов */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-6">
              <div className="flex flex-wrap gap-2 text-xs font-medium bg-stone-100 p-1 rounded-xl w-fit">
                {zones.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setActiveZone(z)}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeZone === z
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {z === "all" ? "Все зоны" : z}
                  </button>
                ))}
              </div>

              {visibleTables.length === 0 && !loading ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  Столов по выбранным параметрам нет.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {visibleTables.map((table) => {
                    const isSelected = selectedTable?.id === table.id;
                    let bgStyle =
                      "bg-white border-stone-200 text-stone-900 hover:border-stone-400";
                    if (table.status === "occupied") {
                      bgStyle = "bg-stone-900 text-white border-stone-900";
                    } else if (table.status === "reserved") {
                      bgStyle = "bg-amber-50 text-amber-950 border-amber-300";
                    }
                    if (isSelected) {
                      bgStyle += " ring-2 ring-[#D4B273]";
                    }

                    return (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => setSelectedTableId(table.id)}
                        className={`p-5 rounded-2xl border flex flex-col items-center justify-center transition-all text-center ${bgStyle}`}
                      >
                        <span className="font-serif font-medium text-lg">
                          {table.code || `Стол #${table.id}`}
                        </span>
                        <span className="text-[11px] opacity-80 mt-1">
                          {table.capacity ? `${table.capacity} мест` : ""}
                          {table.zone ? ` · ${table.zone}` : ""}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider mt-2 opacity-85">
                          {STATUS_LABELS[table.status] || table.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Карточка выбранного стола */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-6">
              {selectedTable ? (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-stone-400">
                      Стол {selectedTable.code || selectedTable.id}
                    </span>
                    <h3 className="font-serif text-xl text-stone-900 mt-1">
                      {STATUS_LABELS[selectedTable.status] ||
                        selectedTable.status}
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs border-y border-stone-100 py-4">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Вместимость</span>
                      <span className="font-medium">
                        {selectedTable.capacity ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Зона</span>
                      <span className="font-medium">
                        {selectedTable.zone || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Активен</span>
                      <span className="font-medium">
                        {selectedTable.is_active === false ? "Нет" : "Да"}
                      </span>
                    </div>
                  </div>

                  {selectedTable.reservation ? (
                    <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-1.5">
                      <p className="font-medium text-stone-900">
                        {selectedTable.reservation.reservation_number ||
                          `Бронь #${selectedTable.reservation.id}`}
                        {selectedTable.reservation.guest_name
                          ? ` · ${selectedTable.reservation.guest_name}`
                          : ""}
                      </p>
                      {selectedTable.reservation.status && (
                        <p className="text-stone-600">
                          Статус брони: {selectedTable.reservation.status}
                        </p>
                      )}
                      {(selectedTable.reservation.date ||
                        selectedTable.reservation.start_time) && (
                        <p className="text-stone-600 font-mono">
                          {selectedTable.reservation.date}{" "}
                          {selectedTable.reservation.start_time}
                          {selectedTable.reservation.end_time
                            ? `–${selectedTable.reservation.end_time}`
                            : ""}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400">
                      Нет активной информации о брони для этого стола.
                    </p>
                  )}

                  {canManage &&
                    selectedTable.reservation?.id &&
                    selectedTable.reservation?.status === "confirmed" && (
                      <button
                        type="button"
                        disabled={actionBusy}
                        onClick={() =>
                          handleArriveGuest(selectedTable.reservation.id)
                        }
                        className="w-full py-3.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-950 text-xs uppercase tracking-widest font-medium rounded-xl transition shadow-sm disabled:opacity-50"
                      >
                        {actionBusy ? "Обновление..." : "Отметить прибытие"}
                      </button>
                    )}
                </div>
              ) : (
                <p className="text-xs text-stone-400 text-center py-12">
                  Выберите стол на схеме
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
