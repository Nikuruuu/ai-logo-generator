"use client";

import React, { useState } from "react";
import Lookup from "../_data/Lookup";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import AiButton from "@/components/animata/button/ai-button";

function Hero() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = () => {
    setIsLoading(true);
    router.push("/create");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-6 md:pt-12 lg:pt-16">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
        {/* Left column - Text content */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-6 pt-2 md:pt-4">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm self-start">
            <Sparkles className="h-5 w-5 text-brand-primary" />
            <span className="font-medium text-brand-primary">
              AI Logo Creator
            </span>
          </div>
          <TextEffect
            className="text-brand-primary text-3xl md:text-4xl font-bold"
            preset="fade-in-blur"
            as="h2"
            speedReveal={1.1}
            speedSegment={0.3}
          >
            {Lookup.HeroHeading}
          </TextEffect>

          <TextEffect
            className="text-brand-primary-text text-xl md:text-2xl font-bold"
            per="word"
            as="h3"
            preset="blur"
          >
            {Lookup.HeroSubheading}
          </TextEffect>

          <TextEffect
            className="text-base md:text-lg text-gray-500 max-w-xl"
            per="char"
            preset="fade"
            as="p"
          >
            {Lookup.HeroDescription}
          </TextEffect>

          <AiButton onClick={handleNavigation} disabled={isLoading}>
            Get started
          </AiButton>
        </div>

        {/* Right column - Illustration */}
        <div className="hidden md:flex w-full md:w-1/2 justify-end">
          <div className="relative w-full">
            <div className="flex justify-end">
              <Image
                src="/hero_v2.svg"
                alt="AI Logo Creation Illustration"
                width={350}
                height={350}
                className="object-contain translate-x-4 md:translate-x-8 lg:translate-x-12"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
