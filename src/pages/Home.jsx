import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Плитка для вашего дома</h1>
      <p>Большой выбор коллекций: мрамор, дерево, бетон и классика.</p>
      <Link to="/catalog" className="button">Смотреть каталог</Link>
    </section>
  );
}