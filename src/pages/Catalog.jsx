import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { categories } from "../config/categories";
import { filterConfig } from "../config/filters";
import TileCard from "../components/TileCard";
import Filters from "../components/Filters";

const PAGE_SIZE = 24;

export default function Catalog() {
  const { category } = useParams();
  const cat = categories.find((c) => c.slug === category);
  const filters = filterConfig.filter((f) => !f.only || f.only.includes(category));

  const [values, setValues] = useState({});
  const [options, setOptions] = useState({});
  const [tiles, setTiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // при смене категории сбрасываем фильтры
  useEffect(() => {
    setValues({});
    setPage(0);
  }, [category]);

  // варианты для выпадающих списков берём из базы
  useEffect(() => {
    if (!cat) return;
    const keys = filters.filter((f) => f.type === "select").map((f) => f.key);
    supabase
      .from("tiles")
      .select(keys.join(","))
      .eq("category", category)
      .then(({ data }) => {
        const result = {};
        keys.forEach((k) => {
          result[k] = [...new Set((data || []).map((r) => r[k]).filter(Boolean))].sort();
        });
        setOptions(result);
      });
  }, [category]);

  // сами товары
  useEffect(() => {
    if (!cat) return;
    setLoading(true);
    let q = supabase.from("tiles").select("*", { count: "exact" }).eq("category", category);
    filters.forEach((f) => {
      if (f.type === "select" && values[f.key]) q = q.eq(f.key, values[f.key]);
      if (f.type === "range") {
        if (values[f.key + "_min"]) q = q.gte(f.key, values[f.key + "_min"]);
        if (values[f.key + "_max"]) q = q.lte(f.key, values[f.key + "_max"]);
      }
    });
    q.order("name")
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
      .then(({ data, count, error }) => {
        if (error) setError(error.message);
        else { setTiles(data); setTotal(count || 0); setError(null); }
        setLoading(false);
      });
  }, [category, values, page]);

  if (!cat) return <Navigate to="/" replace />;

  const changeFilter = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setPage(0);
  };

  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <h1>{cat.name}</h1>
      <div className="catalog-layout">
        <Filters filters={filters} options={options} values={values}
          onChange={changeFilter} onReset={() => { setValues({}); setPage(0); }} />
        <div>
          {error && <p>Ошибка: {error}</p>}
          {loading ? <p>Загрузка...</p> : tiles.length === 0 ? <p>Ничего не найдено.</p> : (
            <div className="grid">
              {tiles.map((t) => <TileCard key={t.id} tile={t} />)}
            </div>
          )}
          {pages > 1 && (
            <div className="pager">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>←</button>
              <span>{page + 1} / {pages}</span>
              <button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>→</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}