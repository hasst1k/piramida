import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="logo">TileShop</NavLink>
      <nav>
        <NavLink to="/">Главная</NavLink>
        <NavLink to="/contacts">Контакты</NavLink>
        <NavLink to="/account">Аккаунт</NavLink>
        <NavLink to="/cart">Корзина</NavLink>
      </nav>
    </header>
  );
} 