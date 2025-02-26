"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function Header() {
  const { user, isLoaded } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on client side
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };

      // Set initial value
      handleResize();

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Clean up
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return (
    <div className="px-4 sm:px-10 lg:px-32 xl:px-48 2xl:px-56 p-2 flex justify-between items-center shadow-sm">
      <Link href="/" className="relative">
        {isMobile ? (
          // Mobile logo (icon only)
          <Image
            src="/mobile-logo.svg" // Replace with your mobile logo path
            alt="logo"
            width={0}
            height={0}
            priority
            className="w-[50px] h-[50px]"
          />
        ) : (
          // Desktop logo (with text)
          <Image
            src="/deepLogo.svg"
            alt="logo"
            width={0}
            height={0}
            priority
            className="w-[200px] h-[80px]"
          />
        )}
      </Link>
      <div className="flex gap-2 sm:gap-4 items-center">
        {isLoaded && (
          <>
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="text-xs sm:text-sm px-2 sm:px-4"
                  >
                    Dashboard
                  </Button>
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 sm:w-10 sm:h-10",
                    },
                  }}
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
