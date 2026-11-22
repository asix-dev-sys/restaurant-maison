
import React, { useState } from "react";
import "./Checkout.css";

function Checkout({
  cartItems,
  onBack,
  onSuccess,
  changeQuantity
}) {
  const [orderType, setOrderType] = useState("delivery");
  const [payment, setPayment] = useState("cash");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    time: "",
    comment: ""
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSuccess();
  }

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={onBack}>
        ← Назад в меню
      </button>

      <div className="checkout-container">
        <div className="checkout-form">
          <span className="checkout-label">MAISON RESTAURANT</span>
          <h1>Оформление заказа</h1>
          <p>Заполните данные для получения заказа</p>

          <form onSubmit={handleSubmit}>
            <h3>Как получить заказ?</h3>

            <div className="order-types">
              <button
                type="button"
                className={orderType === "delivery" ? "chosen" : ""}
                onClick={() => setOrderType("delivery")}
              >
                Доставка
              </button>

              <button
                type="button"
                className={orderType === "pickup" ? "chosen" : ""}
                onClick={() => setOrderType("pickup")}
              >
                Самовывоз
              </button>

              <button
                type="button"
                className={orderType === "table" ? "chosen" : ""}
                onClick={() => setOrderType("table")}
              >
                К столику
              </button>
            </div>

            <h3>Контактные данные</h3>

            <label>Ваше имя</label>
            <input
              required
              placeholder="Введите имя"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <label>Номер телефона</label>
            <input
              required
              type="tel"
              placeholder="+996 ___ ___ ___"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            {orderType === "delivery" && (
              <>
                <label>Адрес доставки</label>
                <input
                  required
                  placeholder="Улица, дом, квартира"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </>
            )}

            {orderType === "table" && (
              <>
                <label>Номер забронированного столика</label>
                <input
                  required
                  placeholder="Введите номер столика"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </>
            )}

            <label>Время получения</label>
            <input
              required
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />

            <label>Комментарий</label>
            <textarea
              placeholder="Пожелания к заказу..."
              value={form.comment}
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
            />

            <h3>Способ оплаты</h3>

            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "cash"}
                  onChange={() => setPayment("cash")}
                />
                Наличными
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                Банковская карта при получении
              </label>
            </div>

            <button className="place-order" type="submit">
              Подтвердить заказ
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Ваш заказ</h2>

          {cartItems.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>
                {Number(item.price) * item.quantity} сом
              </strong>
            </div>
          ))}

          <div className="summary-total">
            <span>Итого</span>
            <strong>{totalPrice} сом</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
