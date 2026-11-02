// type: "select" (список из базы) или "range" (от-до)
// only: показывать фильтр только в этих категориях (необязательно)
export const filterConfig = [
  { key: "brand", label: "Бренд", type: "select" },
  { key: "country", label: "Страна производителя", type: "select" },
  { key: "size", label: "Размер", type: "select" },
  { key: "segment", label: "Ценовой сегмент", type: "select" },
  { key: "price", label: "Цена за м²", type: "range" },
];