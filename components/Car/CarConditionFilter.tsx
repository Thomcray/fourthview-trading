"use client";

import { motion } from "framer-motion";

const OPTIONS = ["All Cars", "New", "Used"];

type Props = {
  selected: string;
  onSelect: (value: string) => void;
};

export default function CarConditionFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            {isActive && (
              <motion.span
                layoutId="car-filter-pill"
                className="absolute inset-0 bg-blue-600 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
