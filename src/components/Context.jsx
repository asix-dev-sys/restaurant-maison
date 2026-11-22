import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Context.css";

const API = "https://maison-restaurant.duckdns.org/api/v1/";

function Context({ category, setCategory, search, setSearch }) {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const [categoriesRes, dishesRes] = await Promise.all([
          axios.get(`${API}categories/`),
          axios.get(`${API}dishes/`)
        ]);

        setCategories(categoriesRes.data);
        setDishes(dishesRes.data.results);
      } catch (error) {
        console.log("Ошибка загрузки категорий:", error);
      }
    }

    getData();
  }, []);

  const selected = categories.find(
    (item) => item.slug === category
  );

  const selectedCount = category
    ? dishes.filter((dish) => dish.category?.slug === category).length
    : dishes.length;

  return (
    <div className="container">
      <main>
        <section className="catalog">
          <div className="catalog-toolbar">
            <div className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Поиск блюда"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className={`filter-button ${showFilters ? "selected" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>☷</span> Фильтры
            </button>
          </div>

          {showFilters && (
            <div className="filter-panel">
              <span>Фильтры скоро появятся</span>
            </div>
          )}

          <div className="category-tabs">
            <button
              className={`category-tab ${category === "" ? "active" : ""}`}
              onClick={() => setCategory("")}
            >
              Все блюда
            </button>

            {categories.map((item) => (
              <button
                key={item.id}
                className={`category-tab ${
                  category === item.slug ? "active" : ""
                }`}
                onClick={() => setCategory(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="catalog-heading">
            <div>
              <span className="eyebrow">ВЫБРАНО ДЛЯ ВАС</span>
              <h2>{selected?.name || "Все блюда"}</h2>
            </div>

            <span className="dish-count">
              {selectedCount} блюд
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Context;