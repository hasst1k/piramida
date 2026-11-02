import { Link } from "react-router-dom";
import { categories } from "../config/categories";


export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Плитка, керамогранит и ламинат</h1>
        <p>Широкий выбор покрытий для вашего дома. Доставка и консультация.</p>
      </section>


      <section className="categories">
        {categories.map((c) => (
          <Link key={c.slug} to={`/catalog/${c.slug}`} className="category-card">
            <h2>{c.name}</h2>
            <p>{c.text}</p>
            <span>Смотреть →</span>
          </Link>
        ))}
      </section>
    </>
  );
}