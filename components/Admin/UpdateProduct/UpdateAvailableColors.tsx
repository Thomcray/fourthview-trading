"use client";

import { Check } from "lucide-react";
import { useUpdateForm } from "./UpdateForm";

const definedColours = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#7F7F7F" },
  { name: "Red", hex: "#FF0000" },
  { name: "Orange", hex: "#FF9900" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Green", hex: "#00FF00" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Purple", hex: "#9900FF" },
  { name: "Magenta", hex: "#FF00FF" },
];

export default function UpdateAvailableColours() {
  const { colours, setColours } = useUpdateForm();

  const toggleColour = (hex: string) => {
    if (colours.includes(hex)) {
      setColours(colours.filter((c) => c !== hex));
    } else {
      setColours([...colours, hex]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row flex-wrap gap-3">
        {definedColours.map((colour) => {
          const isSelected = colours.includes(colour.hex);
          const isLight = ["#FFFFFF", "#FFFF00", "#00FFFF"].includes(
            colour.hex,
          );

          return (
            <button
              type="button"
              key={colour.hex}
              title={colour.name}
              onClick={() => toggleColour(colour.hex)}
              style={{ backgroundColor: colour.hex }}
              className={`relative w-8 h-8 rounded-full border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-blue-500 scale-110 shadow-md"
                    : "border-slate-200 hover:border-slate-400 hover:scale-105"
                }`}
            >
              {isSelected && (
                <Check
                  className={`absolute inset-0 m-auto w-4 h-4 ${isLight ? "text-slate-700" : "text-white"}`}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>

      {colours.length > 0 ? (
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Selected:</span>
          {colours.map((hex) => {
            const match = definedColours.find((c) => c.hex === hex);
            return (
              <div
                key={hex}
                className="flex flex-row items-center gap-1.5 bg-slate-50 border rounded-full px-2 py-1"
              >
                <span
                  className="w-3 h-3 rounded-full border border-slate-200"
                  style={{ backgroundColor: hex }}
                />
                <span className="text-xs text-slate-600">
                  {match?.name ?? hex}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No colours selected yet</p>
      )}
    </div>
  );
}
