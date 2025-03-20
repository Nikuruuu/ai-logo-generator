"use client";

import React, { useState } from "react";
import LogoTitle from "./_components/LogoTitle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LogoDescription from "./_components/LogoDescription";
import LogoColorPalette from "./_components/LogoColorPalette";
import LogoDesigns from "./_components/LogoDesigns";
import LogoIdea from "./_components/LogoIdea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PricingModel from "./_components/PricingModel";
function CreateLogo() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    console.log(formData);
    if (value && typeof value === "string" && value.trim() !== "") {
      setError("");
    }
  };

  const handleNextStep = () => {
    // Validate required fields before proceeding
    if (step === 1 && (!formData.title || formData.title.trim() === "")) {
      setError("Title cannot be empty.");
      return;
    }
    if (step === 2 && (!formData.desc || formData.desc.trim() === "")) {
      setError("Description cannot be empty.");
      return;
    }
    if (step === 3 && (!formData.palette || formData.palette.trim() === "")) {
      setError(
        "Color palette selection cannot be empty. Please choose a color palette."
      );
      return;
    }
    if (step === 4 && !formData?.design) {
      // Just check if design exists
      setError("Design selection cannot be empty. Please select a design.");
      return;
    }
    if (step === 5 && (!formData.idea || formData.idea.trim() === "")) {
      setError("Idea input cannot be empty. Please provide an idea.");
      return;
    }

    setError(""); // Clear error if validation passes
    setStep(step + 1);
  };
  return (
    <div className="mt-8 md:mt-16 p-4 sm:p-6 md:p-8 border-2 border-gray-300 rounded-xl shadow-lg mx-2 sm:mx-4 bg-white max-w-4xl md:mx-auto">
      {step == 1 ? (
        <LogoTitle
          onHandleInputChange={(v) => onHandleInputChange("title", v)}
          formData={formData}
        />
      ) : step == 2 ? (
        <LogoDescription
          onHandleInputChange={(v) => onHandleInputChange("desc", v)}
          formData={formData}
        />
      ) : step == 3 ? (
        <LogoColorPalette
          onHandleInputChange={(v) => onHandleInputChange("palette", v)}
          formData={formData}
        />
      ) : step == 4 ? (
        <LogoDesigns
          onHandleInputChange={(v) => onHandleInputChange("design", v)}
          formData={formData}
        />
      ) : step == 5 ? (
        <LogoIdea
          onHandleInputChange={(v) => onHandleInputChange("idea", v)}
          formData={formData}
        />
      ) : step == 6 ? (
        <PricingModel
          onHandleInputChange={(v) => onHandleInputChange("pricing", v)}
          formData={formData}
        />
      ) : null}
      <div className="flex items-center justify-between mt-10">
        {step != 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            {" "}
            <ArrowLeft />
            Previous
          </Button>
        )}
        <Button
          onClick={handleNextStep}
          className="bg-brand-primary hover:bg-brand-secondary"
        >
          <ArrowRight />
          Continue
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4 ">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default CreateLogo;
