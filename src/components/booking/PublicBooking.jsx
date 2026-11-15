import React, { useState } from "react";
import api from "../../services/api";

export default function PublicBooking() {
  const [formData, setFormData] = useState({
    guest_name: "",
    phone: "",
    date: "",
    start_time: "19:00",
    guests_count: 2,
    guest_note: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ИСПРАВЛЕНО: отправляем start_time как есть ("HH:MM"), без добавления ":00"
      const response = await api.post("reservations/", {
        guest_name: formData.guest_name.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        start_time: formData.start_time,
        guests_count: Number(formData.guests_count),
        guest_note: formData.guest_note || "",
      });

      setSuccessData(response);
    } catch (err) {
      console.error("Ошибка при бронировании:", err.response?.data || err);

      const errorData = err.response?.data;
      let errorMsg = "Не удалось отправить заявку. Проверьте введенные данные.";

      if (errorData) {
        if (typeof errorData === "string") {
          errorMsg = errorData;
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else {
          errorMsg = Object.entries(errorData)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`,
            )
            .join(" | ");
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 font-sans text-stone-950 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-normal text-stone-900">
            MAISON Restaurant
          </h2>
          <p className="text-xs uppercase tracking-widest text-stone-400 mt-2">
            Забронировать столик
          </p>
        </div>

        {successData ? (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-4">
            <h3 className="font-serif text-xl text-stone-900">
              Заявка принята!
            </h3>
            <p className="text-sm text-stone-600">
              {successData.message ||
                "Спасибо за заявку. Мы свяжемся с вами для подтверждения."}
            </p>
            <div className="inline-block bg-white px-4 py-2 rounded-xl border border-amber-200 text-stone-900 font-mono font-medium text-sm">
              Номер брони: {successData.reservation_number || "Успешно"}
            </div>
            <div>
              <button
                onClick={() => {
                  setSuccessData(null);
                  setFormData({
                    guest_name: "",
                    phone: "",
                    date: "",
                    start_time: "19:00",
                    guests_count: 2,
                    guest_note: "",
                  });
                }}
                className="mt-4 px-6 py-2.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 text-xs font-medium uppercase tracking-widest rounded-xl transition"
              >
                Создать ещё одну бронь
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl break-words">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                Ваше имя
              </label>
              <input
                type="text"
                name="guest_name"
                required
                placeholder="Тимур Беков"
                value={formData.guest_name}
                onChange={handleChange}
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                Номер телефона
              </label>
              <input
                type="text"
                name="phone"
                required
                placeholder="+996555010027"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                  Дата
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                  Время (12:00 – 23:00)
                </label>
                <input
                  type="time"
                  name="start_time"
                  required
                  min="12:00"
                  max="23:00"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                Количество гостей (от 1 до 6)
              </label>
              <input
                type="number"
                name="guests_count"
                required
                min="1"
                max="6"
                value={formData.guests_count}
                onChange={handleChange}
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                Пожелания (необязательно)
              </label>
              <textarea
                name="guest_note"
                rows="2"
                placeholder="Стол у окна"
                value={formData.guest_note}
                onChange={handleChange}
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 font-medium rounded-xl uppercase tracking-widest text-xs transition shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? "Отправка заявки..." : "Забронировать"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
