import { NavLink } from "react-router-dom";
import { categories } from "../config/categories";

export default function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="logo">TileShop</NavLink>
      <nav>
        <NavLink to="/">Главная</NavLink>
        {categories.map((c) => (
          <NavLink key={c.slug} to={`/catalog/${c.slug}`}>{c.name}</NavLink>
        ))}
        <NavLink to="/contacts">Контакты</NavLink>
      </nav>
    </header>
  );
}