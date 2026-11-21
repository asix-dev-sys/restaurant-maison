import React, { useState } from "react";
import { Link } from "react-router-dom";
import { reservationService } from "../../services/reservationService";

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
      const data = await reservationService.createPublic({
        guest_name: formData.guest_name.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        start_time: formData.start_time,
        guests_count: Number(formData.guests_count),
        guest_note: formData.guest_note.trim(),
      });

      setSuccessData(data);
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-950 flex flex-col justify-between">
      <main className="max-w-6xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-stone-400">
            Особенный вечер
          </span>
          <h1 className="text-4xl font-serif font-normal text-stone-900 leading-tight">
            Забронировать стол
          </h1>
          <p className="text-stone-500 text-sm">
            Оставьте заявку, и мы свяжемся с вами для подтверждения.
          </p>
          <div className="rounded-3xl overflow-hidden shadow-sm border border-stone-100 max-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
              alt="Интерьер Maison"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-stone-400">
              Вечер в Maison
            </span>
            <h2 className="text-2xl font-serif text-stone-900 mt-1">
              Детали бронирования
            </h2>
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
                  type="button"
                  onClick={() => {
                    setSuccessData(null);
                    setError("");
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
                    Время
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
                  Количество гостей
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
                  Ваше имя
                </label>
                <input
                  type="text"
                  name="guest_name"
                  required
                  placeholder="Как к вам обращаться"
                  value={formData.guest_name}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                  Телефон
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+996 ___ __-__-__"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5">
                  Пожелания (необязательно)
                </label>
                <input
                  type="text"
                  name="guest_note"
                  placeholder="Стол у окна, особый повод..."
                  value={formData.guest_note}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>

              <p className="text-[11px] text-stone-400">
                Пожалуйста, укажите удобное время и контактные данные.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 font-medium rounded-xl uppercase tracking-widest text-xs transition shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? "Отправка заявки..." : "Отправить заявку"}
              </button>

              <p className="text-[10px] text-stone-400 text-center mt-2">
                Нажимая кнопку, вы соглашаетесь на обработку данных.
              </p>
            </form>
          )}
        </div>
      </main>

      <footer className="w-full bg-stone-950 text-white px-8 py-6 flex justify-between items-center text-xs tracking-widest uppercase">
        <span className="font-serif text-lg tracking-normal">MAISON</span>
        <span className="text-stone-500 normal-case text-xs">
          Искусство вкуса в каждой детали
        </span>
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-[#D4B273]">
            Главная
          </Link>
          <Link to="/booking" className="hover:text-[#D4B273]">
            Бронирование
          </Link>
          <a href="/#contacts" className="hover:text-[#D4B273]">
            Контакты
          </a>
        </div>
      </footer>
    </div>
  );
}
