
import { useMemo, useState } from "react";
import "./AdminImport.css";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ");

function findColumn(headers, variants) {
  return headers.findIndex((header) =>
    variants.includes(normalize(header))
  );
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(
    String(value)
      .replace(",", ".")
      .replace(/\s/g, "")
  );

  return Number.isFinite(number) ? number : null;
}

// Извлечение размера, поверхности и информации об упаковке
function parseProductName(name) {
  const text = String(name ?? "");

  let size = "";

  // Пример: 25*150*0,9 или 60×120×0.9
  const dimensionMatch = text.match(
    /(\d{1,3}(?:[.,]\d+)?)\s*[хx×*]\s*(\d{1,3}(?:[.,]\d+)?)\s*[хx×*]\s*(\d{1,2}(?:[.,]\d+)?)/i
  );

  if (dimensionMatch) {
    const first = dimensionMatch[1].replace(",", ".");
    const second = dimensionMatch[2].replace(",", ".");
    const third = dimensionMatch[3].replace(",", ".");

    size = `${first} × ${second} × ${third}`;
  } else {
    // Если указаны только два размера
    const simpleMatch = text.match(
      /(\d{1,3}(?:[.,]\d+)?)\s*[хx×*]\s*(\d{1,3}(?:[.,]\d+)?)/i
    );

    if (simpleMatch) {
      const first = simpleMatch[1].replace(",", ".");
      const second = simpleMatch[2].replace(",", ".");

      size = `${first} × ${second}`;
    }
  }

  // Информация об упаковке
  const packagingMatch = text.match(
    /(\d+(?:[.,]\d+)?)\s*м2\s*\(\s*1\s*к\s*=\s*(\d+)\s*\)/i
  );

  const areaMatch = text.match(
    /(\d+(?:[.,]\d+)?)\s*м2/i
  );

  // Поверхность
  let surface = "";

  if (/мат\.|матовый|матовая/i.test(text)) {
    surface = "Матовая";
  } else if (/полир|глянц/i.test(text)) {
    surface = "Полированная";
  } else if (/лаппат|lappato/i.test(text)) {
    surface = "Лаппатированная";
  }

  const rectified = /рект/i.test(text);

  return {
    size,
    surface,
    edge: rectified ? "Ректифицированная" : "",
    packageArea: packagingMatch
      ? parseNumber(packagingMatch[1])
      : areaMatch
        ? parseNumber(areaMatch[1])
        : null,
    piecesPerPackage: packagingMatch
      ? Number(packagingMatch[2])
      : null,
  };
}

// Чтение Excel
async function readExcel(file) {
  const XLSX = await import("xlsx");

  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("В файле не найден лист с данными.");
  }

  const sheet = workbook.Sheets[firstSheetName];

  return XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });
}

export default function AdminImport() {
  const [fileName, setFileName] = useState("");
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validProducts = useMemo(
    () =>
      products.filter(
        (product) => product.brand && product.name
      ),
    [products]
  );

  async function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setMessage("");
    setProducts([]);
    setErrors([]);
    setFileName(file.name);

    try {
      const rows = await readExcel(file);

      if (!rows.length) {
        throw new Error("Excel-файл пустой.");
      }

      const headers = rows[0];

      const brandIndex = findColumn(headers, [
        "бренд",
      ]);

      const nameIndex = findColumn(headers, [
        "наименование",
        "название",
        "товар",
      ]);

      const unitIndex = findColumn(headers, [
        "единица измерения",
        "единица измерения.",
        "ед. изм.",
        "единица",
      ]);

      const priceIndex = findColumn(headers, [
        "цена",
        "розничная цена",
      ]);

      const articleIndex = findColumn(headers, [
        "артикул",
        "код",
        "код товара",
      ]);

      if (brandIndex === -1 || nameIndex === -1) {
        throw new Error(
          'Не найдены обязательные колонки «Бренд» и «Наименование».'
        );
      }

      const imported = [];
      const rowErrors = [];

      rows.slice(1).forEach((row, index) => {
        const brand = String(
          row[brandIndex] ?? ""
        ).trim();

        const name = String(
          row[nameIndex] ?? ""
        ).trim();

        // Пропускаем пустые строки
        if (!brand && !name) return;

        if (!brand || !name) {
          rowErrors.push(
            `Строка ${index + 2}: отсутствует бренд или наименование.`
          );
          return;
        }

        // Распознаём характеристики
        const parsed = parseProductName(name);

        imported.push({
          id: `${index}-${brand}-${name}`,

          article:
            articleIndex >= 0
              ? String(row[articleIndex] ?? "").trim()
              : "",

          brand,
          name,

          unit:
            unitIndex >= 0
              ? String(row[unitIndex] ?? "").trim()
              : "",

          price:
            priceIndex >= 0
              ? parseNumber(row[priceIndex])
              : null,

          size: parsed.size,
          surface: parsed.surface,
          edge: parsed.edge,
          packageArea: parsed.packageArea,
          piecesPerPackage: parsed.piecesPerPackage,

          sourceRow: index + 2,
        });
      });

      setProducts(imported);
      setErrors(rowErrors);

      setMessage(
        `Обработано товаров: ${imported.length}. Ошибок: ${rowErrors.length}.`
      );

      if (imported.length === 0 && rowErrors.length === 0) {
        setMessage("В файле не найдено ни одной товарной строки.");
      }
    } catch (error) {
      setMessage(
        error.message || "Не удалось прочитать Excel-файл."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  // Выгрузка распознанных данных в JSON
  function downloadPreview() {
    const data = JSON.stringify(products, null, 2);

    const blob = new Blob([data], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "piramida-import-preview.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-import">
      <header className="admin-import__header">
        <div>
          <span className="admin-import__eyebrow">
            ПИРАМИДА САЛОН ПЛИТКИ
          </span>

          <h1>Импорт товаров</h1>

          <p>
            Загружайте Excel-файл, проверяйте характеристики
            и подготавливайте каталог к обновлению.
          </p>
        </div>
      </header>

      <section className="admin-import__upload">
        <div className="admin-import__upload-icon">
          XLS
        </div>

        <h2>Загрузка Excel-файла</h2>

        <p>
          Поддерживаются XLS и XLSX с колонками
          «Бренд», «Наименование», «Единица Измерения» и «Цена».
        </p>

        <label className="admin-import__button">
          {loading
            ? "Читаем файл..."
            : "Выбрать Excel-файл"}

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            disabled={loading}
          />
        </label>

        {fileName && (
          <span className="admin-import__filename">
            Файл: {fileName}
          </span>
        )}

        {message && (
          <div className="admin-import__message">
            {message}
          </div>
        )}
      </section>

      {products.length > 0 && (
        <>
          <section className="admin-import__stats">
            <div>
              <strong>{products.length}</strong>
              <span>Распознано товаров</span>
            </div>

            <div>
              <strong>{validProducts.length}</strong>
              <span>Готово к проверке</span>
            </div>

            <div>
              <strong>{errors.length}</strong>
              <span>Ошибок строк</span>
            </div>
          </section>

          <section className="admin-import__results">
            <div className="admin-import__results-heading">
              <div>
                <h2>Предварительный просмотр</h2>
                <p>
                  Проверьте распознанные характеристики товаров.
                </p>
              </div>

              <button
                type="button"
                className="admin-import__secondary"
                onClick={downloadPreview}
              >
                Скачать JSON
              </button>
            </div>

            <div className="admin-import__table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Бренд</th>
                    <th>Наименование</th>
                    <th>Размер</th>
                    <th>Поверхность</th>
                    <th>Ед. изм.</th>
                    <th>Цена</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.brand}</td>

                      <td className="admin-import__product-name">
                        {product.name}
                      </td>

                      <td>
                        {product.size || "Не определён"}
                      </td>

                      <td>
                        {product.surface || "—"}
                      </td>

                      <td>
                        {product.unit || "—"}
                      </td>

                      <td>
                        {product.price === null
                          ? "Не указана"
                          : product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {errors.length > 0 && (
        <section className="admin-import__errors">
          <h2>Строки, требующие проверки</h2>

          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </section>
      )}
    </main>
  );
}
