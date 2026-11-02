import React, { useState } from "react";

export default function UserDashboard({ bookings = [], favorites = [] }) {
  const [activeTab, setActiveTab] = useState("bookings");

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-2xl font-bold mb-6">Личный кабинет</h2>

      {/* Вкладки */}
      <div className="flex border-b mb-6 space-x-8 text-sm md:text-base font-medium">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 transition-colors border-b-2 ${activeTab === "bookings" ? "border-amber-600 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          История бронирований ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`pb-3 transition-colors border-b-2 ${activeTab === "favorites" ? "border-amber-600 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          Избранное ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 transition-colors border-b-2 ${activeTab === "profile" ? "border-amber-600 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
        >
          Профиль и адреса
        </button>
      </div>

      {activeTab === "bookings" && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-400 mb-4">
                У вас пока нет активных бронирований
              </p>
              <a
                href="/booking"
                className="inline-block px-6 py-2.5 bg-amber-600 text-white rounded-xl shadow hover:bg-amber-700 transition text-sm font-medium"
              >
                Забронировать столик
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center border border-gray-100"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      Столик: №{b.tableId} ({b.zone})
                    </p>
                    <p className="text-sm text-gray-500">
                      {b.date} в {b.time} • Гостей: {b.guests}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    Активен
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
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-400 mb-2">Список избранного пуст</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold">{dish.name}</h4>
                    <p className="text-sm text-amber-600 font-medium">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
          <h3 className="text-lg font-semibold mb-4">Персональные данные</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                type="text"
                name="name"
                placeholder="Введите ваше имя"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+996 (___) __-__-__"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сохраненный адрес доставки
              </label>
              <input
                type="text"
                name="address"
                placeholder="Улица, дом, квартира"
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition shadow-sm mt-2"
            >
              Сохранить изменения
            </button>

            {isSaved && (
              <p className="text-sm text-green-600 text-center font-medium mt-2">
                Данные успешно сохранены!
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
