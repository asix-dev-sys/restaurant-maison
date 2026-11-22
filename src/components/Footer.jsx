import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-container">

        <div className="footer-column footer-brand">
          <h3>MAISON</h3>
          <span className="footer-subtitle">RESTAURANT</span>
          <p>Искусство вкуса в каждой детали.</p>
        </div>

        <div className="footer-column">
          <h4>НАВИГАЦИЯ</h4>
          <a href="/">Главная</a>
          <a href="/menu">Меню</a>
          <a href="/about">О ресторане</a>
        </div>

        <div className="footer-column">
          <h4>СВЯЖИТЕСЬ С НАМИ</h4>
          <p>Бишкек, Кыргызстан</p>
          <p>Ежедневно · 12:00–23:00</p>
        </div>

        <div className="footer-column footer-booking">
          <h4>ОСОБЕННЫЙ ВЕЧЕР</h4>
          <a href="#booking" className="booking-link">
            ЗАБРОНИРОВАТЬ <span>↗</span>
          </a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 MAISON RESTAURANT</p>
        <p>СОЗДАНО С ЛЮБОВЬЮ К ДЕТАЛЯМ</p>
      </div>
    </div>
  );
}

export default Footer;