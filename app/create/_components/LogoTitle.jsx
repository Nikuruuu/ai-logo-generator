"use client";

import React from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import { Input } from "@/components/ui/input";

function LogoTitle({ onHandleInputChange, formData }) {
  return (
    <div className="my-4 md:my-6 px-2 md:px-0">
      <HeadingDescription
        title={Lookup?.LogoTitle}
        description={Lookup?.LogoTitleDesc}
      />
      <Input
        type="text"
        placeholder={Lookup?.LogoTitlePlaceholder}
        className="p-4 md:p-6 text-base md:text-lg border rounded-md w-full mt-5 "
        value={formData?.title || ""} // Ensure controlled input
        onChange={(event) => onHandleInputChange(event.target.value)}
      />
    </div>
  );
}

export default LogoTitle;
