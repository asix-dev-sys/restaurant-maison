import React, { useState, useEffect } from "react";

const TABLES = [
  { id: "t1", number: "Т1", zone: "terrace", seats: 2, label: "У окна" },
  { id: "t2", number: "Т2", zone: "terrace", seats: 4, label: "У окна" },
  { id: "v1", number: "VIP 1", zone: "vip", seats: 6, label: "VIP-зона" },
  { id: "v2", number: "VIP 2", zone: "vip", seats: 8, label: "VIP-зона" },
  { id: "m1", number: "М1", zone: "main", seats: 4, label: "Основной зал" },
  { id: "m2", number: "М2", zone: "main", seats: 2, label: "Основной зал" },
  { id: "m3", number: "М3", zone: "main", seats: 4, label: "Основной зал" },
];

export default function TableMap({ data, setData, onNext, onPrev }) {
  const [selectedZone, setSelectedZone] = useState("all");
  const [bookedTableIds, setBookedTableIds] = useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(
      localStorage.getItem("restaurant_bookings") || "[]",
    );

    const occupied = savedBookings
      .filter((b) => b.date === data.date && b.time === data.time)
      .map((b) => b.tableId);

    setBookedTableIds(occupied);
  }, [data.date, data.time]);

  const filteredTables =
    selectedZone === "all"
      ? TABLES
      : TABLES.filter((t) => t.zone === selectedZone);

  const handleSelectTable = (tableId) => {
    if (bookedTableIds.includes(tableId)) return;
    setData((prev) => ({
      ...prev,
      tableId: tableId,
      zone: TABLES.find((t) => t.id === tableId)?.zone,
    }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Шаг 2: Выберите столик</h3>
      <p className="text-sm text-gray-500 mb-6">
        Нажмите на свободный столик на схеме зала{" "}
        {data.date && data.time ? `(на ${data.date} в ${data.time})` : ""}
      </p>

      <div className="flex space-x-2 mb-6 bg-gray-100 p-1.5 rounded-xl text-sm font-medium">
        <button
          onClick={() => setSelectedZone("all")}
          className={`flex-1 py-2 rounded-lg transition ${selectedZone === "all" ? "bg-white shadow text-amber-600" : "text-gray-600 hover:text-gray-900"}`}
        >
          Все зоны
        </button>
        <button
          onClick={() => setSelectedZone("terrace")}
          className={`flex-1 py-2 rounded-lg transition ${selectedZone === "terrace" ? "bg-white shadow text-amber-600" : "text-gray-600 hover:text-gray-900"}`}
        >
          Терраса
        </button>
        <button
          onClick={() => setSelectedZone("vip")}
          className={`flex-1 py-2 rounded-lg transition ${selectedZone === "vip" ? "bg-white shadow text-amber-600" : "text-gray-600 hover:text-gray-900"}`}
        >
          VIP
        </button>
        <button
          onClick={() => setSelectedZone("main")}
          className={`flex-1 py-2 rounded-lg transition ${selectedZone === "main" ? "bg-white shadow text-amber-600" : "text-gray-600 hover:text-gray-900"}`}
        >
          Основной зал
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {filteredTables.map((table) => {
          const isSelected = data.tableId === table.id;
          const isBooked = bookedTableIds.includes(table.id);

          let style = "bg-white border-gray-200 hover:border-amber-500";
          if (isBooked) {
            style = "bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed";
          } else if (isSelected) {
            style =
              "bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-600 ring-offset-2";
          }

          return (
            <button
              key={table.id}
              onClick={() => handleSelectTable(table.id)}
              disabled={isBooked}
              className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${style}`}
            >
              <span className="font-bold text-lg">{table.number}</span>
              <span
                className={`text-xs uppercase tracking-wider mt-1 ${isSelected ? "text-amber-100" : "text-gray-400"}`}
              >
                {table.label}
              </span>
              <span
                className={`text-xs mt-2 ${isSelected ? "text-amber-100" : "text-gray-600"}`}
              >
                👥 {table.seats} мест
              </span>
              {isBooked && (
                <span className="text-[10px] text-red-500 font-semibold mt-1">
                  Занят
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-2.5 border rounded-xl hover:bg-gray-50 transition"
        >
          Назад
        </button>
        <button
          onClick={onNext}
          disabled={!data.tableId}
          className="px-6 py-2.5 bg-amber-600 text-white rounded-xl disabled:opacity-50 hover:bg-amber-700 transition shadow-sm"
        >
          Далее (Пожелания)
        </button>
      </div>
    </div>
  );
}
