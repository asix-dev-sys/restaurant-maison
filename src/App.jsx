
import React, { useState } from "react";
import "./App.css";

import Header from "./header/Header";
import Ben from "./ben/Ben";
import Context from "./context/Context";
import Ned from "./ned/Ned";
import Footer from "./footer/Footer";
import Checkout from "./checkout/Checkout";
import Booking from "./booking/Booking";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("menu");

  // Добавление товара в корзину
  function addToCart(dish) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);

      if (existing) {
        return prev.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...dish, quantity: 1 }];
    });
  }

  // Изменение количества
  function changeQuantity(id, amount) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Удаление товара
  function removeFromCart(id) {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  return (
    <div className="App">
      <Header
        cartItems={cartItems}
        onBooking={() => setPage("booking")}
        onCheckout={() => setPage("checkout")}
        changeQuantity={changeQuantity}
        removeFromCart={removeFromCart}
      />

      {page === "menu" && (
        <>
          <Ben />

          <Context
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
          />

          <Ned
            addToCart={addToCart}
            category={category}
            search={search}
          />
        </>
      )}

      {page === "checkout" && (
        <Checkout
          cartItems={cartItems}
          onBack={() => setPage("menu")}
          onSuccess={() => {
            setCartItems([]);
            setPage("success");
          }}
          changeQuantity={changeQuantity}
        />
      )}

      {page === "booking" && (
        <Booking
          onBack={() => setPage("menu")}
          onSuccess={() => setPage("booking-success")}
        />
      )}

      {page === "success" && (
        <div className="success-screen">
          <h1>Заказ оформлен!</h1>
          <p>Спасибо за ваш заказ в MAISON.</p>
          <button onClick={() => setPage("menu")}>
            Вернуться в меню
          </button>
        </div>
      )}

      {page === "booking-success" && (
        <div className="success-screen">
          <h1>Заявка отправлена!</h1>
          <p>Спасибо! Ожидайте подтверждения бронирования.</p>
          <button onClick={() => setPage("menu")}>
            Вернуться на главную
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
