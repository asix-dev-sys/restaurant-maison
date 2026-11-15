import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function UserDashboard({
  bookings: initialBookings = [],
  favorites = [],
}) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState(initialBookings);

  // Состояние профиля
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  // Загружаем бронирования и данные профиля из localStorage при монтировании
  useEffect(() => {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("maison_bookings") || "[]",
      );
      if (savedBookings.length > 0) {
        setBookings(savedBookings);
      }

      const savedProfile = localStorage.getItem("maison_user_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  // Функция сохранения профиля (локально)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("maison_user_profile", JSON.stringify(profile));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-950 font-sans pt-8">
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-serif font-normal mb-6 text-stone-900">
          Личный кабинет
        </h2>

        <div className="flex border-b border-stone-200 mb-8 space-x-8 text-sm md:text-base font-medium">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "bookings"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-stone-400 hover:text-stone-900"
            }`}
          >
            История бронирований ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "favorites"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-stone-400 hover:text-stone-900"
            }`}
          >
            Избранное ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === "profile"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-stone-400 hover:text-stone-900"
            }`}
          >
            Профиль и адреса
          </button>
        </div>

        {activeTab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
                <p className="text-stone-400 mb-6 text-sm">
                  У вас пока нет активных бронирований
                </p>
                <Link
                  to="/booking"
                  className="inline-block px-8 py-3.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 rounded-xl shadow-sm transition text-xs font-medium uppercase tracking-widest"
                >
                  Забронировать столик
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id || b.reservation_number || Math.random()}
                    className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center border border-stone-100 gap-4"
                  >
                    <div>
                      <p className="font-serif text-lg text-stone-900 font-medium">
                        {b.table
                          ? `Столик №${b.table.code}`
                          : "Заявка на бронирование"}
                        {b.reservation_number && (
                          <span className="text-xs text-stone-400 ml-2 font-mono">
                            ({b.reservation_number})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Дата: {b.date} в {b.start_time || b.time} • Гостей:{" "}
                        {b.guests_count || b.guests}
                      </p>
                    </div>
                    <span className="px-3.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {b.status || "pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
                <p className="text-stone-400 text-sm">Список избранного пуст</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-serif font-medium text-stone-900">
                        {dish.name}
                      </h4>
                      <p className="text-sm text-amber-700 font-medium mt-1">
                        {dish.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 max-w-xl">
            <h3 className="text-xl font-serif font-medium mb-6 text-stone-900">
              Персональные данные
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Введите ваше имя"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                  Телефон
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+996 (___) __-__-__"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                  Сохраненный адрес доставки
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Улица, дом, квартира"
                  value={profile.address}
                  onChange={handleProfileChange}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 font-medium rounded-xl uppercase tracking-widest text-xs transition shadow-sm mt-2"
              >
                Сохранить изменения
              </button>

              {isSaved && (
                <p className="text-xs text-green-700 text-center font-medium mt-3">
                  Данные успешно сохранены!
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
