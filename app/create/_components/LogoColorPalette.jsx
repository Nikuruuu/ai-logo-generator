import React, { useState } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import Colors from "@/app/_data/Colors";

function LogoColorPalette({ onHandleInputChange, formData }) {
  const [selectedOption, setSelectedOption] = useState(formData?.palette);
  return (
    <div className="my-4 md:my-6 px-2 md:px-0">
      <HeadingDescription
        title={Lookup.LogoColorPaletteTitle}
        description={Lookup.LogoColorPaletteDesc}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mt-3 md:mt-5">
        {Colors.map((palette, index) => (
          <div
            className={`flex p-1 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedOption === palette.name
                ? "ring-2 ring-brand-primary rounded-lg shadow-sm"
                : "rounded-lg hover:ring-1 hover:ring-gray-200"
            }`}
            key={index}
          >
            {palette?.colors.map((color, index) => (
              <div
                className="h-16 sm:h-20 md:h-24 w-full"
                key={index}
                onClick={() => {
                  setSelectedOption(palette.name);
                  onHandleInputChange(palette.name);
                }}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoColorPalette;
