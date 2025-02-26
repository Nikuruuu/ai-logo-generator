import React from "react";

function HeadingDescription({ title, description }) {
  return (
    <div className="mb-3 md:mb-4">
      <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-brand-primary">
        {title}
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-1 md:mt-2">
        {description}
      </p>
    </div>
  );
}

export default HeadingDescription;
