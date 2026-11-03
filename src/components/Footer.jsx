export default function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} TileShop <span aria-hidden="true">·</span> Материалы для вашего пространства
    </footer>
  );
}
