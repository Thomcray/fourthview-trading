export type CategoryColors = {
  color: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
};

const BRAND_COLORS: Record<string, CategoryColors> = {
  Men: {
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50",
    textColor: "text-blue-950",
    buttonColor: "hover:bg-blue-50",
  },
  Women: {
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-950",
    buttonColor: "hover:bg-pink-50",
  },
  Kids: {
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-950",
    buttonColor: "hover:bg-green-50",
  },
  Furniture: {
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-950",
    buttonColor: "hover:bg-amber-50",
  },
  "Home & Living": {
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-950",
    buttonColor: "hover:bg-amber-50",
  },
  Electronics: {
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-950",
    buttonColor: "hover:bg-cyan-50",
  },
  Sports: {
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-950",
    buttonColor: "hover:bg-orange-50",
  },
  Beauty: {
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-950",
    buttonColor: "hover:bg-purple-50",
  },
};

const FALLBACK_PALETTES: CategoryColors[] = [
  {
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-950",
    buttonColor: "hover:bg-indigo-50",
  },
  {
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-950",
    buttonColor: "hover:bg-teal-50",
  },
  {
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-950",
    buttonColor: "hover:bg-red-50",
  },
  {
    color: "from-lime-500 to-lime-600",
    bgColor: "bg-lime-50",
    textColor: "text-lime-950",
    buttonColor: "hover:bg-lime-50",
  },
  {
    color: "from-fuchsia-500 to-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    textColor: "text-fuchsia-950",
    buttonColor: "hover:bg-fuchsia-50",
  },
  {
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-50",
    textColor: "text-sky-950",
    buttonColor: "hover:bg-sky-50",
  },
];

function getStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getColorsForCategory(name: string): CategoryColors {
  if (BRAND_COLORS[name]) return BRAND_COLORS[name];
  const normalizedName = name.toLowerCase().trim();
  const hash = getStringHash(normalizedName);
  return FALLBACK_PALETTES[hash % FALLBACK_PALETTES.length];
}
