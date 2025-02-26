"use client";

import React, { useEffect } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function PricingModel({ formData }) {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (formData?.title && typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  const handlePricingClick = (pricingTitle) => {
    const redirectUrl = `/generate-logo?type=${encodeURIComponent(
      pricingTitle
    )}`;
    if (user) {
      router.push(redirectUrl);
    } else {
      localStorage.setItem("redirectAfterLogin", redirectUrl);
    }
  };

  return (
    <div>
      <HeadingDescription
        title={Lookup.LogoPricingModelTitle}
        description={Lookup.LogoPricingModelDesc}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">
        {Lookup.pricingOption.map((pricing, index) => (
          <div
            className="flex flex-col items-center p-5 border rounded-xl"
            key={index}
          >
            <Image
              src={pricing.icon}
              alt={pricing.title}
              width={60}
              height={60}
              unoptimized
            />
            <h2 className="font-medium text-2xl text-brand-primary">
              {pricing.title}
            </h2>
            <div>
              {pricing.features.map((feature, index) => (
                <h2 className="text-lg mt-3" key={index}>
                  {feature}
                </h2>
              ))}
            </div>
            {user ? (
              <Button
                className="mt-5 bg-brand-primary hover:bg-brand-secondary"
                onClick={() => handlePricingClick(pricing.title)}
              >
                {[pricing.button]}
              </Button>
            ) : (
              <SignInButton
                mode="modal"
                forceRedirectUrl={`/generate-logo?type=${encodeURIComponent(
                  pricing.title
                )}`}
              >
                <Button className="mt-5 bg-brand-primary hover:bg-brand-secondary">
                  {[pricing.button]}
                </Button>
              </SignInButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingModel;
