import React from "react";

export default function SpecialRequests({ data, setData, onNext, onPrev }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Шаг 3: Особые пожелания</h3>
      <p className="text-sm text-gray-500 mb-6">
        Укажите детали, чтобы мы сделали ваш вечер особенным
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Аллергии или ограничения в еде
          </label>
          <input
            type="text"
            name="allergies"
            placeholder="Например: аллергия на глютен, орехи"
            value={data.allergies}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий к бронированию (повод)
          </label>
          <textarea
            name="wishes"
            rows="3"
            placeholder="День рождения, годовщина, пожелания по обслуживанию..."
            value={data.wishes}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
        </div>
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
          className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition shadow-sm"
        >
          Завершить бронирование
        </button>
      </div>
    </div>
  );
}
