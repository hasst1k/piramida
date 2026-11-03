import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="logo" aria-label="TileShop — главная">TileShop</NavLink>
      <nav aria-label="Основная навигация">
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/catalog/tile">Каталог</NavLink>
        <NavLink to="/contacts">Контакты</NavLink>
        <NavLink to="/account">Аккаунт</NavLink>
        <NavLink to="/cart">Корзина</NavLink>
      </nav>
    </header>
  );
}
