import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <h1>404: страница не найдена</h1>
      <Link to="/">На главную</Link>
    </>
  );
}