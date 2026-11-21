import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function getRouteByRole(role) {
  if (role === "chef") return "/staff/kitchen";
  if (role === "waiter") return "/admin/orders";
  return "/admin/dashboard";
}

export default function StaffLogin({ onLoginSuccess }) {
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({
    work_email: "",
    password: "",
    remember_me: false,
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const profile = JSON.parse(
        localStorage.getItem("staff_profile") || "null",
      );
      if (profile?.role) {
        navigate(getRouteByRole(profile.role), { replace: true });
      }
    } catch {
      // Игнорируем битый JSON в localStorage
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        work_email: formData.work_email,
        password: formData.password,
        remember_me: formData.remember_me,
      };

      const response = await api.post("staff/auth/login/", payload);
      const data = response.data || response;

      if (data.access) localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      if (data.profile) {
        localStorage.setItem("staff_profile", JSON.stringify(data.profile));
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.profile);
      }

      navigate(getRouteByRole(data.profile?.role), { replace: true });
    } catch (err) {
      console.error("Ошибка входа:", err);
      const dataErr = err.response?.data;
      const fieldMsg =
        dataErr?.work_email?.[0] ||
        dataErr?.password?.[0] ||
        dataErr?.non_field_errors?.[0];
      setError(
        dataErr?.detail ||
          dataErr?.error ||
          fieldMsg ||
          "Неверная рабочая почта или пароль.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await api.post("staff/auth/password-reset/", {
        work_email: forgotEmail,
      });
      setSuccessMsg(
        response.data?.detail ||
          response.data?.message ||
          "Запрос на восстановление пароля отправлен.",
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.work_email?.[0] ||
          "Восстановление пароля недоступно или почта не найдена.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] grid grid-cols-1 lg:grid-cols-2 font-sans text-stone-950">
      <div className="bg-stone-950 text-white p-12 flex flex-col justify-between">
        <div className="space-y-4">
          <h1 className="font-serif text-2xl tracking-wide">MAISON</h1>
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Внутренняя система
          </p>
        </div>
        <div className="space-y-6 my-auto">
          <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-2xl max-w-md">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
              alt="Maison"
              className="w-full h-64 object-cover opacity-90"
            />
          </div>
          <div>
            <h2 className="font-serif text-2xl mb-2">
              Искусство сервиса.
              <br />
              Точность в деталях.
            </h2>
            <p className="text-stone-400 text-xs leading-relaxed">
              Единое пространство команды, которое создает особенный вечер для
              каждого гостя.
            </p>
          </div>
        </div>
        <div className="text-[11px] text-stone-500 uppercase tracking-wider">
          MAISON · ВНУТРЕННЯЯ СИСТЕМА
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative">
          {!isForgot ? (
            <>
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  Система для сотрудников
                </span>
                <h2 className="text-2xl font-serif text-stone-900 mt-2">
                  Вход в систему
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Войдите в рабочее пространство MAISON
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                    Рабочая почта
                  </label>
                  <input
                    type="email"
                    name="work_email"
                    required
                    placeholder="owner@example.com"
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
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSuccessMsg("");
                      setIsForgot(true);
                    }}
                    className="text-amber-700 hover:underline"
                  >
                    Забыли пароль?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 font-medium rounded-xl uppercase tracking-widest text-xs transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Вход..." : "Войти в систему"}
                </button>
              </form>

              <div className="mt-6 p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-500 text-center">
                🔒 Доступ выдается администратором. Вход строго для сотрудников
                ресторана.
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccessMsg("");
                    setIsForgot(false);
                  }}
                  className="text-xs text-stone-400 hover:text-stone-950 mb-2 block"
                >
                  ← Вернуться ко входу
                </button>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  Восстановление доступа
                </span>
                <h2 className="text-2xl font-serif text-stone-900 mt-1">
                  Забыли пароль?
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Укажите рабочий адрес. Мы отправим ссылку для создания нового
                  пароля.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
                    Рабочая почта
                  </label>
                  <input
                    type="email"
                    name="work_email"
                    required
                    placeholder="owner@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-600 outline-none text-sm text-stone-800 transition"
                  />
                  <p className="text-[11px] text-stone-400 mt-1.5">
                    Используйте адрес, на который выдан доступ.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#D4B273] hover:bg-[#c4a163] text-stone-900 font-medium rounded-xl uppercase tracking-widest text-xs transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Отправка..." : "Отправить ссылку"}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-stone-100 text-[11px] text-stone-400 flex justify-between">
            <span>Нужна помощь? Обратитесь к администратору.</span>
            <span>MAISON © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
