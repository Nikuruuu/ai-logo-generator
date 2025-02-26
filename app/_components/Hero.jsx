"use client";

import React, { useState } from "react";
import Lookup from "../_data/Lookup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

function Hero() {
  const router = useRouter();
  const [logoTitle, setLogoTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async () => {
    if (isLoading) return;

    if (!logoTitle.trim()) {
      setError("Logo title cannot be empty.");
      return;
    }

    try {
      setIsLoading(true);
      setError(""); // Clear error if valid
      await router.push(`/create?title=${encodeURIComponent(logoTitle)}`);
    } catch (error) {
      setError("Navigation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center mt-8 sm:mt-12 md:mt-24 flex-col gap-2 sm:gap-3 md:gap-5 px-4 md:px-6">
      <h2 className="text-brand-primary text-xl sm:text-2xl md:text-4xl font-bold text-center">
        {Lookup.HeroHeading}
      </h2>
      <h2 className="text-brand-primary-text text-lg sm:text-xl md:text-3xl font-bold text-center">
        {Lookup.HeroSubheading}
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-500 text-center max-w-2xl px-2">
        {Lookup.HeroDescription}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full max-w-2xl mt-4 sm:mt-6 md:mt-10 px-2 sm:px-0">
        <Input
          placeholder={Lookup.InputPlaceholder}
          className="p-3 sm:p-4 md:p-6 text-sm sm:text-base md:text-lg border rounded-md w-full shadow-sm focus:shadow-md"
          onChange={(event) => setLogoTitle(event?.target.value)}
        />

        <Button
          onClick={handleNavigation}
          className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary p-3 sm:p-4 md:p-6 mt-1 sm:mt-0 text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default Hero;
