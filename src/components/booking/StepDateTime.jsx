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
        {/* Поле даты: пишется цифрами руками или выбирается через календарь */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="date"
              placeholder="ДД.ММ.ГГГГ"
              value={data.date}
              onChange={handleChange}
              className="w-full p-3 pr-10 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            />
            {/* Поверх ставим прозрачный инпут даты, чтобы по клику на иконку открывался календарь */}
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleChange}
              className="absolute right-3 opacity-0 w-8 h-8 cursor-pointer"
              title="Открыть календарь"
            />
            <span className="absolute right-3 text-gray-400 pointer-events-none text-lg">
              📅
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">
            Введите дату вручную (например: 05.11.2026) или выберите из
            календаря
          </span>
        </div>

        {/* Поле времени: пишется цифрами руками или выбирается через часы */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Время
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="time"
              placeholder="Например: 19:30"
              value={data.time}
              onChange={handleChange}
              className="w-full p-3 pr-10 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            />
            {/* Поверх ставим прозрачный инпут времени для вызова нативного виджета */}
            <input
              type="time"
              name="time"
              value={data.time}
              onChange={handleChange}
              className="absolute right-3 opacity-0 w-8 h-8 cursor-pointer"
              title="Выбрать время"
            />
            <span className="absolute right-3 text-gray-400 pointer-events-none text-lg">
              🕒
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">
            Введите время вручную (например: 18:30) или выберите из меню
          </span>
        </div>

        {/* Количество гостей */}
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
