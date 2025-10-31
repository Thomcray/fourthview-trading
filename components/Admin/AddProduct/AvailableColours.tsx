import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

type Colour = {
  name: string;
  hex: string;
};

interface ColourInterface {
  colours: Colour[];
  setColours: (colours: Colour[]) => void;
}

export default function AvailableColours({
  colours,
  setColours,
}: ColourInterface) {
  const [colourHex, setColourHex] = useState("#000000");
  //   const [colourName, setColourName] = useState("");

  const addColour = () => {
    if (!colourHex.trim()) return;

    const exists = colours.some(
      (colour) => colour.hex.toLowerCase() === colourHex.toLowerCase()
    );

    if (exists) {
      return toast.error("Colour already exists!");
    }

    setColours([...colours, { name: colourHex, hex: colourHex }]);
    setColourHex("#000000");
  };

  const removeColour = (colour: string) => {
    setColours(colours.filter((c) => c.hex !== colour));
  };

  return (
    <div className="w-full flex flex-row max-sm:flex-col items-center gap-4 border-0">
      <div className="w-full flex flex-row max-sm:flex-col gap-2 items-center border-0">
        <Input
          type="color"
          placeholder="Colour name (e.g., Red)"
          value={colourHex}
          onChange={(e) => setColourHex(e.target.value)}
          className="w-10 h-10 max-sm:w-full cursor-pointer !p-0 border-0"
        />

        <Input
          type="text"
          placeholder="Colour name (e.g., #000)"
          value={colourHex}
          className="py-6 px-4 w-fit max-sm:w-full"
          readOnly
        />

        <Button
          variant="outline"
          type="button"
          className="w-max max-sm:w-full text-sm cursor-pointer"
          onClick={addColour}
        >
          Add Colour
        </Button>
      </div>

      <div className="w-full flex flex-wrap gap-2">
        {colours.length < 0 ? (
          <p className="text-sm text-slate-500">No colour selected yet!</p>
        ) : (
          colours.map((colour) => (
            <div key={colour.hex} className="flex flex-row items-center gap-1">
              <span
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: colour.hex }}
              ></span>

              <Button
                variant="ghost"
                className="w-max cursor-pointer"
                onClick={() => removeColour(colour.hex)}
              >
                <X size={14} className="text-slate-500 hover:text-black" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
