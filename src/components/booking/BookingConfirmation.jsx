import React from "react";
import { Link } from "react-router-dom";

export default function BookingConfirmation({ data }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
        ✓
      </div>
      <h3 className="text-2xl font-bold mb-2">Столик успешно забронирован!</h3>
      <p className="text-gray-600 mb-6">
        Мы ждем вас{" "}
        <span className="font-semibold text-gray-900">{data.date}</span> в{" "}
        <span className="font-semibold text-gray-900">{data.time}</span>. Выбран
        столик:{" "}
        <span className="font-semibold text-amber-600">№{data.tableId}</span> (
        {data.zone}).
      </p>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm text-amber-800 mb-8 max-w-sm mx-auto">
        Статус бронирования: <span className="font-bold">«Активен»</span>. Вы
        можете отслеживать его в личном кабинете.
      </div>

      <Link
        to="/dashboard"
        className="inline-block px-8 py-3 bg-amber-600 text-white font-medium rounded-xl shadow hover:bg-amber-700 transition"
      >
        Перейти в личный кабинет
      </Link>
    </div>
  );
}
