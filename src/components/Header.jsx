
import { NavLink } from "react-router-dom";
import logo from "../assets/piramida-logo.png";

export default function Header() {
  return (
    <header className="header">
      <NavLink
        to="/"
        className="logo"
        aria-label="Пирамида Салон Плитки — главная"
      >
        <img
          src={logo}
          alt="Эмблема Пирамида"
          className="logo-image"
        />

        <span>Пирамида Салон Плитки</span>
      </NavLink>

      <nav aria-label="Основная навигация">
        <NavLink to="/" end>
          Главная
        </NavLink>

        <NavLink to="/catalog/tile">
          Каталог
        </NavLink>

        <NavLink to="/contacts">
          Контакты
        </NavLink>

        <NavLink to="/account">
          Аккаунт
        </NavLink>

        <NavLink to="/cart">
          Корзина
        </NavLink>
      </nav>
    </header>
  );
}
