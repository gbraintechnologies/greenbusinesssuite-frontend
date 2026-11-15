export type SuiteProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  category: string;
  published: boolean;
  logoUrl?: string;
  mark: string;
  accent: string;
  wash: string;
  sortOrder?: number;
};

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
    sortOrder: 1,
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
    sortOrder: 2,
  },
];

/** @deprecated Prefer API-backed suite apps */
export const suiteProducts = defaultSuiteProducts;

const ACCENTS = [
  { accent: "bg-[#14532d]", wash: "bg-[#f0fdf4]" },
  { accent: "bg-[#0b57d0]", wash: "bg-[#e8f0fe]" },
  { accent: "bg-[#0f766e]", wash: "bg-[#f0fdfa]" },
  { accent: "bg-[#9a3412]", wash: "bg-[#fff7ed]" },
  { accent: "bg-[#1e3a5f]", wash: "bg-[#eff6ff]" },
];

export function createEmptySuiteProduct(
  overrides: Partial<SuiteProduct> = {}
): SuiteProduct {
  const palette = ACCENTS[0];
  return {
    id: `draft-${Date.now()}`,
    name: "",
    tagline: "",
    description: "",
    href: "",
    category: "App",
    published: false,
    logoUrl: undefined,
    mark: "A",
    accent: palette.accent,
    wash: palette.wash,
    sortOrder: 0,
    ...overrides,
  };
}
