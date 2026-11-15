import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function StaffLogin({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    work_email: "",
    password: "",
    remember_me: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.post("staff/auth/login/", formData);

      // Сохраняем токены и профиль
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("staff_profile", JSON.stringify(data.profile));

      if (onLoginSuccess) {
        onLoginSuccess(data.profile);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Неверная рабочая почта или пароль.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 font-sans text-stone-950">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-normal text-stone-900">
            MAISON Restaurant
          </h2>
          <p className="text-xs uppercase tracking-widest text-stone-400 mt-2">
            Вход для персонала
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
              Рабочая почта
            </label>
            <input
              type="email"
              name="work_email"
              required
              placeholder="waiter@example.com"
              value={formData.work_email}
              onChange={handleChange}
              className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                name="remember_me"
                checked={formData.remember_me}
                onChange={handleChange}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Запомнить меня</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 font-medium rounded-xl uppercase tracking-widest text-xs transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти в систему"}
          </button>
        </form>
      </div>
    </div>
  );
}
