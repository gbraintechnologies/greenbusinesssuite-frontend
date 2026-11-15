export type SuiteProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  category: string;
  published: boolean;
  mark: string;
  accent: string;
  wash: string;
};

export const SUITE_PRODUCTS_STORAGE_KEY = "gbs.suiteProducts.v1";

export const defaultSuiteProducts: SuiteProduct[] = [
  {
    id: "autobus",
    name: "Autobus",
    tagline: "AI-powered business operations",
    description:
      "Customers, sales, marketing, and your team in one operations workspace.",
    href: "https://useautobus.com/",
    category: "Operations",
    published: true,
    mark: "A",
    accent: "bg-[#14532d]",
    wash: "bg-[#f0fdf4]",
  },
  {
    id: "greenpos",
    name: "GREENPOS",
    tagline: "Point of sale for growing shops",
    description:
      "Take sales, track stock, and close the day from a POS built for African businesses.",
    href: "https://www.usegreenpos.com/",
    category: "Point of sale",
    published: true,
    mark: "G",
    accent: "bg-[#0b57d0]",
    wash: "bg-[#e8f0fe]",
  },
];

/** @deprecated Prefer defaultSuiteProducts / getSuiteProducts */
export const suiteProducts = defaultSuiteProducts;

const ACCENTS = [
  { accent: "bg-[#14532d]", wash: "bg-[#f0fdf4]" },
  { accent: "bg-[#0b57d0]", wash: "bg-[#e8f0fe]" },
  { accent: "bg-[#0f766e]", wash: "bg-[#f0fdfa]" },
  { accent: "bg-[#9a3412]", wash: "bg-[#fff7ed]" },
  { accent: "bg-[#1e3a5f]", wash: "bg-[#eff6ff]" },
];

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeProduct(raw: Partial<SuiteProduct>, index = 0): SuiteProduct | null {
  const name = String(raw.name ?? "").trim();
  const href = String(raw.href ?? "").trim();
  if (!name || !href) return null;

  const palette = ACCENTS[index % ACCENTS.length];
  const id =
    String(raw.id ?? "")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase() ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    `app-${index + 1}`;

  return {
    id,
    name,
    tagline: String(raw.tagline ?? "").trim() || "Suite app",
    description:
      String(raw.description ?? "").trim() ||
      "Open this app from your customer portal.",
    href,
    category: String(raw.category ?? "").trim() || "App",
    published: Boolean(raw.published),
    mark:
      String(raw.mark ?? name)
        .trim()
        .charAt(0)
        .toUpperCase() || "A",
    accent: raw.accent || palette.accent,
    wash: raw.wash || palette.wash,
  };
}

export function getSuiteProducts(): SuiteProduct[] {
  if (!isBrowser()) return defaultSuiteProducts;

  try {
    const raw = window.localStorage.getItem(SUITE_PRODUCTS_STORAGE_KEY);
    if (!raw) return defaultSuiteProducts;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultSuiteProducts;
    const products = parsed
      .map((item, index) => normalizeProduct(item, index))
      .filter(Boolean) as SuiteProduct[];
    return products.length > 0 ? products : defaultSuiteProducts;
  } catch {
    return defaultSuiteProducts;
  }
}

export function saveSuiteProducts(products: SuiteProduct[]) {
  if (!isBrowser()) return;
  const normalized = products
    .map((item, index) => normalizeProduct(item, index))
    .filter(Boolean) as SuiteProduct[];
  window.localStorage.setItem(
    SUITE_PRODUCTS_STORAGE_KEY,
    JSON.stringify(normalized)
  );
  window.dispatchEvent(new Event("gbs-suite-products-updated"));
}

export function publishedSuiteProducts() {
  return getSuiteProducts().filter((product) => product.published);
}

export function createEmptySuiteProduct(
  overrides: Partial<SuiteProduct> = {}
): SuiteProduct {
  const palette = ACCENTS[0];
  return {
    id: `app-${Date.now()}`,
    name: "",
    tagline: "",
    description: "",
    href: "",
    category: "App",
    published: false,
    mark: "A",
    accent: palette.accent,
    wash: palette.wash,
    ...overrides,
  };
}
