import { Button } from "@/components/ui/button";

interface ColourInterface {
  colours: string[];
  setColours: (colours: string[]) => void;
}

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
export default function AvailableColours({
  colours,
  setColours,
}: ColourInterface) {
  const addColour = (hex: string) => {
    if (colours.includes(hex)) {
      setColours(colours.filter((c) => c !== hex));
    } else {
      setColours([...colours, hex]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 border-0">
      <div className="w-max grid grid-cols-6 gap-4 items-center border-0">
        {definedColours.map((colour) => (
          <Button
            variant="outline"
            type="button"
            style={{ backgroundColor: colour.hex }}
            className={`w-8 h-8 text-sm cursor-pointer ${colours.includes(colour.hex) ? "scale-110 border-black" : "border-gray-300"}`}
            onClick={() => addColour(colour.hex)}
            key={colour.hex}
            title={colour.name}
          />
        ))}
      </div>

      <div className="w-full flex flex-wrap gap-2">
        {colours.length < 0 ? (
          <p className="text-sm text-slate-500">No colour selected yet!</p>
        ) : (
          <div className="flex flex-row gap-2">
            {colours.length > 0 && <span>Added:</span>}
            {colours.map((colour) => (
              <div key={colour} className="flex flex-row items-center gap-1">
                <span
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: colour }}
                ></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
