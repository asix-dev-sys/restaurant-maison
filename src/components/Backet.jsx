
import React from "react";
import "./Backet.css";

function Backet({
  isOpen,
  setIsOpen,
  cartItems,
  onCheckout,
  changeQuantity,
  removeFromCart
}) {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`cart-drawer ${isOpen ? "active" : ""}`}>
        <div className="cart-header">
          <h2>Моя корзина</h2>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <p>Ваша корзина пуста</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `https://maison-restaurant.duckdns.org${item.image}`
                  }
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.price} сом</p>

                  <div className="quantity">
                    <button
                      onClick={() => changeQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => changeQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    🗑 Удалить
                  </button>
                </div>

                <strong>
                  {Number(item.price) * item.quantity} сом
                </strong>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <h3>Итого: {totalPrice} сом</h3>

          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
}

export default Backet;