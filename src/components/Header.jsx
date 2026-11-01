import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="logo">TileShop</NavLink>
      <nav>
        <NavLink to="/">Главная</NavLink>
        <NavLink to="/catalog">Каталог</NavLink>
        <NavLink to="/contacts">Контакты</NavLink>
      </nav>
    </header>
  );
}