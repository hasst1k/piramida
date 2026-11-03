import { Link } from "react-router-dom";
import { categories } from "../config/categories";

const advantages = [
  { icon: "🚚", title: "Доставка", text: "По городу и по всей стране" },
  { icon: "📐", title: "Расчёт материала", text: "Поможем посчитать количество" },
  { icon: "✅", title: "Гарантия качества", text: "Работаем с проверенными брендами" },
  { icon: "💬", title: "Консультация", text: "Подберём покрытие под ваш бюджет" },
];

export default function Home() {
  return (
    <>
      <section className="hero-big">
        <div className="hero-content">
          <span className="hero-tag">Плитка · Керамогранит · Ламинат</span>
          <h1>Покрытия, с которых начинается ваш интерьер</h1>
          <p>Большой выбор коллекций от проверенных производителей. Подберём материал под любой стиль и бюджет.</p>
          <div className="hero-buttons">
            <Link to="/catalog/tile" className="button">Смотреть каталог</Link>
            <Link to="/contacts" className="button button-light">Связаться с нами</Link>
          </div>
        </div>
      </section>

      <section className="advantages">
        {advantages.map((a) => (
          <div key={a.title} className="advantage">
            <span className="advantage-icon">{a.icon}</span>
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </div>
        ))}
      </section>

      <h2 className="section-title">Выберите категорию</h2>
      <section className="cat-grid">
        {categories.map((c) => (
          <Link
            key={c.slug}
            to={`/catalog/${c.slug}`}
            className="cat-card"
            style={{ "--img": `url(${c.image})` }}
          >
            <div>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
              <span>Смотреть →</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="cta">
        <h2>Не знаете, что выбрать?</h2>
        <p>Расскажите о вашем проекте, и мы подберём варианты.</p>
        <Link to="/contacts" className="button button-light">Получить консультацию</Link>
      </section>
    </>
  );
}