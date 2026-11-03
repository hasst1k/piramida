import { Link } from "react-router-dom";
import { categories } from "../config/categories";

const advantages = [
  { icon: "↗", title: "Удобная доставка", text: "Бережно привезём заказ к удобному времени" },
  { icon: "⌁", title: "Точный расчёт", text: "Поможем рассчитать нужное количество материала" },
  { icon: "◇", title: "Проверенное качество", text: "Подбираем коллекции надёжных производителей" },
  { icon: "✳", title: "Помощь эксперта", text: "Подскажем решение под ваш стиль и бюджет" },
];

export default function Home() {
  return (
    <>
      <section className="hero-big">
        <div className="hero-content">
          <span className="hero-tag">Материалы для красивого пространства</span>
          <h1>Создайте пространство, в котором хочется жить</h1>
          <p>Плитка, керамогранит и напольные покрытия с выразительной фактурой, продуманным качеством и стилем на каждый день.</p>
          <div className="hero-buttons">
            <Link to="/catalog/tile" className="button">Смотреть каталог <span aria-hidden="true">↗</span></Link>
            <Link to="/contacts" className="button button-light">Получить консультацию</Link>
          </div>
        </div>
      </section>

      <section className="advantages" aria-label="Наши преимущества">
        {advantages.map((a) => (
          <div key={a.title} className="advantage">
            <span className="advantage-icon" aria-hidden="true">{a.icon}</span>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="categories-heading">
        <h2 className="section-title" id="categories-heading">Материалы для вашего интерьера</h2>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.slug} to={`/catalog/${c.slug}`} className="cat-card" style={{ "--img": `url(${c.image})` }}>
              <div>
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <span>Открыть категорию&nbsp; ↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Нужна помощь с выбором?</h2>
        <p>Расскажите о вашем проекте — поможем подобрать покрытие, рассчитать количество и найти подходящее решение.</p>
        <Link to="/contacts" className="button button-light">Обсудить проект&nbsp; ↗</Link>
      </section>
    </>
  );
}
