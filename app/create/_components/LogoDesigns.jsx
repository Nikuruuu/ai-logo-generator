import React, { useState } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import LogoDesign from "@/app/_data/LogoDesign";
import Image from "next/image";

function LogoDesigns({ onHandleInputChange, formData }) {
  const [selectedOption, setSelectedOption] = useState(formData?.design?.title);
  return (
    <div className="my-4 md:my-6 px-2 md:px-0">
      <HeadingDescription
        title={Lookup.LogoIdeaTitle}
        description={Lookup.LogoIdeaDesc}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mt-4 md:mt-5">
        {LogoDesign.map((design, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedOption(design.title);
              onHandleInputChange(design);
            }}
            className={`p-2 transition-all duration-200 hover:ring-2 hover:shadow-md ring-brand-primary rounded-xl cursor-pointer ${
              selectedOption == design.title
                ? "ring-2 ring-brand-primary bg-blue-50/30 rounded-xl"
                : ""
            }`}
          >
            <div className="relative w-full h-[140px] sm:h-[160px] md:h-[200px] rounded-lg overflow-hidden">
              <Image
                src={design.image}
                alt={design.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
                priority={index < 6}
              />
            </div>
            <p className="text-center mt-2 font-medium text-sm sm:text-base">
              {design.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoDesigns;
