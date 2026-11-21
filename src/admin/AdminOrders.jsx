import React, { useEffect, useState, useCallback } from "react";
import AdminSidebar from "./AdminSidebar";
import api from "../services/api";

const STATUS_TABS = [
  { key: "all", label: "Все" },
  { key: "draft", label: "Черновики" },
  { key: "new", label: "Новые" },
  { key: "preparing", label: "Готовятся" },
  { key: "ready", label: "Готовы к подаче" },
  { key: "served", label: "Поданы" },
  { key: "closed", label: "Закрыты" },
  { key: "cancelled", label: "Отменены" },
];

const CHANNEL_LABELS = {
  dine_in: "В зале",
  takeaway: "С собой",
  delivery: "Доставка",
};

const STATUS_LABELS = {
  draft: "Черновик",
  new: "Новый",
  preparing: "Готовится",
  ready: "Готов к подаче",
  served: "Подан",
  closed: "Закрыт",
  cancelled: "Отменён",
};

function formatSom(value) {
  if (value === null || value === undefined || value === "") return "0 сом";
  const num = Number(value);
  if (Number.isNaN(num)) return `${value} сом`;
  return `${num.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} сом`;
}

function formatTimeBishkek(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bishkek",
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem("staff_profile") || "null");
  } catch {
    profile = null;
  }

  const role = profile?.role || "waiter";
  const isManager = role === "owner" || role === "administrator";
  const canOperateOrder =
    role === "owner" || role === "administrator" || role === "waiter";

  const fetchOrderDetail = useCallback(async (orderId) => {
    if (!orderId) {
      setSelectedOrderDetail(null);
      return;
    }
    setDetailLoading(true);
    try {
      const res = await api.get(`staff/orders/${orderId}/`);
      setSelectedOrderDetail(res.data || null);
    } catch (err) {
      setSelectedOrderDetail(null);
      const httpStatus = err.response?.status;
      if (httpStatus === 403) {
        setError("Недостаточно прав для просмотра деталей этого заказа.");
      } else if (httpStatus === 404) {
        setError("Заказ не найден или недоступен.");
      } else {
        setError(
          err.response?.data?.detail || "Не удалось загрузить детали заказа.",
        );
      }
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(
    async ({
      nextStatus = statusFilter,
      nextChannel = channelFilter,
      nextDate = dateFilter,
      nextPage = page,
      keepSelectedId,
    } = {}) => {
      setLoading(true);
      setError("");
      try {
        const params = { page: nextPage };
        if (nextStatus !== "all") params.status = nextStatus;
        if (nextChannel !== "all") params.channel = nextChannel;
        if (nextDate) params.date = nextDate;

        const response = await api.get("staff/orders/", { params });
        const data = response.data || response;
        const list = Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];

        setOrders(list);
        setCount(typeof data?.count === "number" ? data.count : list.length);
        setHasNext(Boolean(data?.next));
        setHasPrev(Boolean(data?.previous));

        const targetId =
          keepSelectedId !== undefined ? keepSelectedId : selectedOrderId;

        if (list.length === 0) {
          setSelectedOrderId(null);
          setSelectedOrderDetail(null);
        } else if (targetId && list.some((o) => o.id === targetId)) {
          setSelectedOrderId(targetId);
          await fetchOrderDetail(targetId);
        } else {
          const firstId = list[0].id;
          setSelectedOrderId(firstId);
          await fetchOrderDetail(firstId);
        }
      } catch (err) {
        const httpStatus = err.response?.status;
        if (httpStatus === 403) {
          setError("Недостаточно прав для просмотра списка заказов.");
        } else {
          setError(
            err.response?.data?.detail ||
              "Не удалось загрузить заказы. Нажмите «Обновить».",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [
      statusFilter,
      channelFilter,
      dateFilter,
      page,
      selectedOrderId,
      fetchOrderDetail,
    ],
  );

  // Первичная загрузка при открытии; далее — только по действиям пользователя
  useEffect(() => {
    fetchOrders({
      nextStatus: "all",
      nextChannel: "all",
      nextDate: "",
      nextPage: 1,
    });
  }, [fetchOrders]);

  const handleSelectOrder = async (orderId) => {
    setError("");
    setInfoMsg("");
    setSelectedOrderId(orderId);
    await fetchOrderDetail(orderId);
  };

  const handleStatusTab = (nextStatus) => {
    setStatusFilter(nextStatus);
    setPage(1);
    fetchOrders({
      nextStatus,
      nextChannel: channelFilter,
      nextDate: dateFilter,
      nextPage: 1,
    });
  };

  const handleChannelChange = (nextChannel) => {
    setChannelFilter(nextChannel);
    setPage(1);
    fetchOrders({
      nextStatus: statusFilter,
      nextChannel,
      nextDate: dateFilter,
      nextPage: 1,
    });
  };

  const handleDateChange = (nextDate) => {
    setDateFilter(nextDate);
    setPage(1);
    fetchOrders({
      nextStatus: statusFilter,
      nextChannel: channelFilter,
      nextDate,
      nextPage: 1,
    });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;
    setPage(nextPage);
    fetchOrders({
      nextStatus: statusFilter,
      nextChannel: channelFilter,
      nextDate: dateFilter,
      nextPage,
    });
  };

  const runOrderMutation = async (
    orderId,
    pathSuffix,
    body = {},
    successText = "",
  ) => {
    setActionBusy(true);
    setError("");
    setInfoMsg("");
    try {
      const res = await api.post(
        `staff/orders/${orderId}/${pathSuffix}/`,
        body,
      );
      if (res?.data && typeof res.data === "object" && res.data.id) {
        setSelectedOrderDetail(res.data);
      }
      if (successText) setInfoMsg(successText);
      await fetchOrders({
        nextStatus: statusFilter,
        nextChannel: channelFilter,
        nextDate: dateFilter,
        nextPage: page,
        keepSelectedId: orderId,
      });
    } catch (err) {
      const dataErr = err.response?.data;
      setError(
        dataErr?.detail ||
          dataErr?.code ||
          dataErr?.reason?.[0] ||
          "Не удалось выполнить действие с заказом.",
      );
    } finally {
      setActionBusy(false);
    }
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrderDetail?.id) return;
    await runOrderMutation(
      selectedOrderDetail.id,
      "cancel",
      { reason: cancelReason.trim() || "Отменено сотрудником" },
      "Заказ отменён.",
    );
    setCancelReason("");
  };

  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const preparingOrdersCount = orders.filter(
    (o) => o.status === "preparing",
  ).length;
  const readyOrdersCount = orders.filter((o) => o.status === "ready").length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-stone-950">
      <AdminSidebar active="orders" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-8 py-4 flex justify-between items-center text-xs">
          <div className="text-stone-500">Бишкек / Ресторан MAISON</div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none focus:border-amber-600"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                fetchOrders({
                  nextStatus: statusFilter,
                  nextChannel: channelFilter,
                  nextDate: dateFilter,
                  nextPage: page,
                })
              }
              className="px-3 py-1.5 bg-[#FAF8F4] border border-stone-200 rounded-lg hover:border-stone-400 transition disabled:opacity-50"
            >
              {loading ? "Загрузка..." : "Обновить"}
            </button>
          </div>
        </header>

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Asia/Bishkek · Записей: {count}
              </p>
              <h1 className="text-3xl font-serif text-stone-900 mt-1">
                Заказы
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                {isManager
                  ? "Все заказы по выбранным фильтрам."
                  : "Ваши заказы по данным сервера."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { key: "all", label: "Все каналы" },
                { key: "dine_in", label: "В зале" },
                { key: "takeaway", label: "С собой" },
                { key: "delivery", label: "Доставка" },
              ].map((ch) => (
                <button
                  key={ch.key}
                  type="button"
                  onClick={() => handleChannelChange(ch.key)}
                  className={`px-3.5 py-2 rounded-xl border transition ${
                    channelFilter === ch.key
                      ? "bg-stone-950 text-white border-stone-950"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Сводка по текущей странице */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-stone-950 text-white p-6 rounded-3xl shadow-sm">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Всего заказов
              </p>
              <p className="text-3xl font-serif mt-2">{count}</p>
              <p className="text-[11px] text-stone-400 mt-4">
                На странице: {orders.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Новые
              </p>
              <p className="text-3xl font-serif text-stone-900 mt-2">
                {newOrdersCount}
              </p>
              <p className="text-[11px] text-amber-700 mt-4">
                Ожидают отправки на кухню
              </p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Готовятся
              </p>
              <p className="text-3xl font-serif text-stone-900 mt-2">
                {preparingOrdersCount}
              </p>
              <p className="text-[11px] text-stone-500 mt-4">В работе кухни</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <p className="text-xs uppercase tracking-widest text-stone-400">
                Готовы к подаче
              </p>
              <p className="text-3xl font-serif text-stone-900 mt-2">
                {readyOrdersCount}
              </p>
              <p className="text-[11px] text-emerald-700 mt-4">
                Ожидают подачи
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl">
              {error}
            </div>
          )}

          {infoMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl">
              {infoMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Список заказов */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-6">
              <div className="flex flex-wrap gap-2 text-xs font-medium bg-stone-100 p-1 rounded-xl w-fit">
                {STATUS_TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => handleStatusTab(t.key)}
                    className={`px-3.5 py-2 rounded-lg transition ${
                      statusFilter === t.key
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {orders.length === 0 && !loading ? (
                <div className="py-12 text-center text-xs text-stone-500">
                  Заказов по выбранным параметрам нет.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-stone-400 uppercase tracking-wider border-b border-stone-100">
                        <th className="pb-3">Заказ / Стол</th>
                        <th className="pb-3">Открыт</th>
                        <th className="pb-3">Канал / Официант</th>
                        <th className="pb-3">Статус</th>
                        <th className="pb-3 text-right">Сумма</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((o) => {
                        const isSelected = selectedOrderId === o.id;
                        return (
                          <tr
                            key={o.id}
                            onClick={() => handleSelectOrder(o.id)}
                            className={`cursor-pointer transition hover:bg-amber-50/40 ${
                              isSelected ? "bg-amber-50/70" : ""
                            }`}
                          >
                            <td className="py-4 font-serif font-medium text-stone-900 whitespace-nowrap">
                              {o.number || `#${o.id}`}
                              {o.table_code ? ` · ${o.table_code}` : ""}
                            </td>
                            <td className="py-4 font-mono text-stone-500 whitespace-nowrap">
                              {formatTimeBishkek(o.created_at)}
                            </td>
                            <td className="py-4 text-stone-700">
                              <div>
                                {CHANNEL_LABELS[o.channel] || o.channel}
                              </div>
                              <div className="text-[11px] text-stone-400">
                                {o.waiter?.full_name || "Без официанта"}
                              </div>
                            </td>
                            <td className="py-4 whitespace-nowrap">
                              <span className="px-3 py-1 rounded-full text-[11px] font-medium border bg-stone-100 text-stone-800 border-stone-200">
                                {STATUS_LABELS[o.status] || o.status}
                              </span>
                            </td>
                            <td className="py-4 text-right font-mono font-medium whitespace-nowrap">
                              <div>{formatSom(o.total)}</div>
                              <div className="text-[10px] text-stone-400">
                                {o.is_paid ? "Оплачен" : "Не оплачен"}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {(hasPrev || hasNext) && (
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <button
                    type="button"
                    disabled={!hasPrev || loading}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-2 border border-stone-200 rounded-xl disabled:opacity-40"
                  >
                    ← Назад
                  </button>
                  <span>Страница {page}</span>
                  <button
                    type="button"
                    disabled={!hasNext || loading}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-2 border border-stone-200 rounded-xl disabled:opacity-40"
                  >
                    Вперёд →
                  </button>
                </div>
              )}
            </div>

            {/* Детали выбранного заказа и действия */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-5">
              {detailLoading ? (
                <p className="text-xs text-stone-400 text-center py-10">
                  Загрузка деталей заказа...
                </p>
              ) : selectedOrderDetail ? (
                <>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-stone-400">
                      {selectedOrderDetail.number ||
                        `#${selectedOrderDetail.id}`}
                    </span>
                    <h2 className="font-serif text-2xl text-stone-900 mt-1">
                      {STATUS_LABELS[selectedOrderDetail.status] ||
                        selectedOrderDetail.status}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {CHANNEL_LABELS[selectedOrderDetail.channel] ||
                        selectedOrderDetail.channel}
                      {selectedOrderDetail.table_code
                        ? ` · Стол ${selectedOrderDetail.table_code}`
                        : ""}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs border-y border-stone-100 py-4">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Официант</span>
                      <span className="font-medium">
                        {selectedOrderDetail.waiter?.full_name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Оплата</span>
                      <span className="font-medium">
                        {selectedOrderDetail.is_paid
                          ? `Оплачен (${selectedOrderDetail.payment_method || "—"})`
                          : "Не оплачен"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Подытог</span>
                      <span className="font-mono">
                        {formatSom(selectedOrderDetail.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-sm pt-1">
                      <span>Итого</span>
                      <span className="font-mono">
                        {formatSom(selectedOrderDetail.total)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-stone-400">
                      Позиции заказа
                    </p>
                    {(selectedOrderDetail.items || []).length === 0 ? (
                      <p className="text-xs text-stone-400">
                        Позиций пока нет.
                      </p>
                    ) : (
                      <ul className="space-y-2 text-xs">
                        {(selectedOrderDetail.items || []).map((item) => (
                          <li
                            key={item.id}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex justify-between gap-2"
                          >
                            <div>
                              <p className="font-medium text-stone-900">
                                {item.quantity} × {item.dish_name}
                              </p>
                              {item.note && (
                                <p className="text-stone-500 mt-0.5">
                                  {item.note}
                                </p>
                              )}
                            </div>
                            <span className="font-mono text-stone-800 shrink-0">
                              {formatSom(item.line_total)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {canOperateOrder && (
                    <div className="space-y-2 pt-2">
                      {selectedOrderDetail.status === "draft" && (
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() =>
                            runOrderMutation(
                              selectedOrderDetail.id,
                              "send",
                              {},
                              "Заказ отправлен на кухню.",
                            )
                          }
                          className="w-full py-2.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-950 text-xs uppercase tracking-widest font-medium rounded-xl transition disabled:opacity-50"
                        >
                          Отправить на кухню
                        </button>
                      )}

                      {selectedOrderDetail.status === "ready" && (
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={() =>
                            runOrderMutation(
                              selectedOrderDetail.id,
                              "serve",
                              {},
                              "Заказ отмечен как поданный.",
                            )
                          }
                          className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-medium rounded-xl transition disabled:opacity-50"
                        >
                          Отметить подачу
                        </button>
                      )}

                      {selectedOrderDetail.status === "served" &&
                        !selectedOrderDetail.is_paid && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() =>
                                runOrderMutation(
                                  selectedOrderDetail.id,
                                  "pay",
                                  { method: "cash" },
                                  "Оплата наличными зафиксирована.",
                                )
                              }
                              className="py-2.5 bg-[#D4B273] hover:bg-[#c4a163] text-stone-950 text-xs uppercase tracking-wider font-medium rounded-xl transition disabled:opacity-50"
                            >
                              Наличные
                            </button>
                            <button
                              type="button"
                              disabled={actionBusy}
                              onClick={() =>
                                runOrderMutation(
                                  selectedOrderDetail.id,
                                  "pay",
                                  { method: "card" },
                                  "Оплата картой зафиксирована.",
                                )
                              }
                              className="py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-wider font-medium rounded-xl transition disabled:opacity-50"
                            >
                              Карта
                            </button>
                          </div>
                        )}

                      {selectedOrderDetail.status === "served" &&
                        selectedOrderDetail.is_paid && (
                          <button
                            type="button"
                            disabled={actionBusy}
                            onClick={() =>
                              runOrderMutation(
                                selectedOrderDetail.id,
                                "close",
                                {},
                                "Заказ закрыт.",
                              )
                            }
                            className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-medium rounded-xl transition disabled:opacity-50"
                          >
                            Закрыть заказ
                          </button>
                        )}

                      {isManager &&
                        (selectedOrderDetail.status === "draft" ||
                          selectedOrderDetail.status === "new") && (
                          <form
                            onSubmit={handleCancelOrder}
                            className="pt-3 border-t border-stone-100 space-y-2"
                          >
                            <input
                              type="text"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Причина отмены..."
                              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-rose-400"
                            />
                            <button
                              type="submit"
                              disabled={actionBusy}
                              className="w-full py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs uppercase tracking-wider rounded-xl transition disabled:opacity-50"
                            >
                              Отменить заказ
                            </button>
                          </form>
                        )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-stone-400 text-center py-10">
                  Выберите заказ из списка
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
