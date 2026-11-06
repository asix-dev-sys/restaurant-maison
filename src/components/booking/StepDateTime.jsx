import React from "react";

export default function StepDateTime({ data, setData, onNext }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isComplete = data.date && data.time && data.guests;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Шаг 1: Дата, время и гости</h3>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата
          </label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Время
          </label>
          <input
            type="time"
            name="time"
            value={data.time}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
          />
          <span className="text-xs text-gray-400 mt-1 block">
            Выберите из меню или введите цифры с клавиатуры
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Количество гостей
          </label>
          <input
            type="number"
            name="guests"
            min="1"
            max="12"
            value={data.guests}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="px-6 py-2.5 bg-amber-600 text-white rounded-xl disabled:opacity-50 hover:bg-amber-700 transition"
        >
          Далее (Выбор столика)
        </button>
      </div>
    </div>
  );
}
