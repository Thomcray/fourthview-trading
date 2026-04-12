"use client";

import { useState } from "react";
import { useApp } from "@/components/AppContext";

const FURNITURE_CATEGORIES = [
  "All Categories",
  "Modern Style",
  "Antique",
  "Chinese Style",
];

type Props = {
  selected: string;
  onSelect: (cat: string) => void;
};

export default function FurnitureCategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="w-full px-4 flex flex-row gap-2 overflow-x-auto pb-1">
      {FURNITURE_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer
            ${
              selected === cat
                ? "bg-blue-950 text-white border-blue-950"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-800"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
