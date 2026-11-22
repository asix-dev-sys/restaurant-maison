import React, { useState } from "react";
import "./Booking.css";
import bookingImg from "../assets/img/booking.jp.jpg";
function Booking({ onBack, onSuccess }) {
  const [form, setForm] = useState({

  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  comment: ""

  });

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Данные бронирования:", form);

    onSuccess();
  }

  return (
    <div className="booking-page">
      <button
        className="back-button"
        type="button"
        onClick={onBack}
      >
        ← Назад
      </button>

      <div className="booking-container">

        <div
          className="booking-image"
         style={{ backgroundImage: `url(${bookingImg})` }}
        >
          <div>
            <span>MAISON RESTAURANT</span>
            <h1>Особенный вечер начинается здесь</h1>
          </div>
        </div>

        <div className="booking-form">
          <span className="booking-label">
            ВАШ СТОЛИК ЖДЁТ ВАС
          </span>

          <h2>Бронирование</h2>
          <p>Заполните форму, чтобы забронировать столик</p>

          <form onSubmit={handleSubmit}>

            <label>Ваше имя</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Введите имя"
              value={form.name}
              onChange={handleChange}
            />

            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+996 ___ ___ ___"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="booking-row">
              <div>
                <label>Дата</label>
                <input
                  type="date"
                  name="date"
                  required
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Время</label>
                <input
                  type="time"
                  name="time"
                  required
                  value={form.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Количество гостей</label>
            <select
              name="guests"
              value={form.guests}
              onChange={handleChange}
            >
              <option value="1">1 гость</option>
              <option value="2">2 гостя</option>
              <option value="3">3 гостя</option>
              <option value="4">4 гостя</option>
              <option value="5">5 гостей</option>
              <option value="6">6 гостей</option>
              <option value="7">7 гостей</option>
              <option value="8">8 гостей</option>
            </select>

            <label>Пожелания</label>
            <textarea
              name="comment"
              placeholder="Особые пожелания..."
              value={form.comment}
              onChange={handleChange}
            />

            <button
              className="booking-submit"
              type="submit"
            >
              Забронировать столик ↗
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;

