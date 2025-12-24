export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "Semua" },
  { id: "breakfast", name: "Sarapan" },
  { id: "lunch", name: "Makan Siang" },
  { id: "dinner", name: "Makan Malam" },
  { id: "snack", name: "Camilan" },
  { id: "mpasi", name: "MPASI" },
  { id: "healthy", name: "Sehat" },
  { id: "traditional", name: "Tradisional" },
  { id: "special", name: "Spesial" },
  { id: "dessert", name: "Dessert" },
];

// Categories for selection (exclude "all")
export const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

// Get category label by id
export const getCategoryLabel = (id: string | undefined): string => {
  const category = CATEGORIES.find((c) => c.id === id);
  return category?.name || id || "Resep";
};
