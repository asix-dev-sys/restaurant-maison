
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Ned.css";

const API = "https://maison-restaurant.duckdns.org/api/v1/dishes/?format=json";

function Ned({ addToCart, category, search }) {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPopular() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(API, {
          params: {
            category: category && category !== "Все блюда" ? category : undefined,
            search: search || undefined
          }
        });

        const data = res.data;

        setPopular(
          Array.isArray(data)
            ? data
            : Array.isArray(data.results)
              ? data.results
              : []
        );

      } catch (error) {
        console.log("Ошибка загрузки блюд:", error);
        setError("Не удалось загрузить блюда.");
      } finally {
        setLoading(false);
      }
    }

    getPopular();
  }, [category, search]);

  if (loading) return <h2>Загрузка блюд...</h2>;

  if (error) return <h2>{error}</h2>;

  return (
    <div className="menu">
      {popular.map((el) => (
        <div className="card" key={el.id || el.slug}>
          <div className="image">
            <img
              src={el.image}
              alt={el.name}
            />
            <button className="heart">♡</button>
          </div>

          <div className="info">
            <div className="heading">
              <h3>{el.name}</h3>
              <h4>{el.price} сом</h4>
            </div>

            <p>
                <h5>{el.short_description}</h5>
  <a
    href={`https://maison-restaurant.duckdns.org/api/v1/dishes/${el.slug}/`}
    target="_blank"
    rel="noreferrer"
  >
    Подробнее о блюде
  </a>
</p>
            <button
              className="cart"
              disabled={!el.is_available}
              onClick={() => addToCart?.(el)}
            >
              {el.is_available ? "＋ В корзину" : "Недоступно"}
            </button>
          </div>
        </div>
      ))}

      {popular.length === 0 && (
        <p>Блюда не найдены.</p>
      )}
    </div>
  );
}

export default Ned;
