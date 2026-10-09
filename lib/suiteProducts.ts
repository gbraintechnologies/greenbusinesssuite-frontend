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

export const suiteProducts: SuiteProduct[] = [
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

export function publishedSuiteProducts() {
  return suiteProducts.filter((product) => product.published);
}
