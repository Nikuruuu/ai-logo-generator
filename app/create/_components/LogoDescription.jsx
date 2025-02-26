import React from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import { Input } from "@/components/ui/input";

function LogoDescription({ onHandleInputChange, formData }) {
  return (
    <div className="my-4 md:my-6 px-2 md:px-0">
      <HeadingDescription
        title={Lookup?.LogoDescTitle}
        description={Lookup?.LogoDescDesc}
      />
      <Input
        type="text"
        placeholder={Lookup?.LogoDescPlaceholder}
        value={formData?.description}
        className="p-4 md:p-6 text-base md:text-lg border rounded-md w-full mt-5 "
        onChange={(event) => onHandleInputChange(event.target.value)}
      />
    </div>
  );
}

export default LogoDescription;
