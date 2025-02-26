"use client";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { UserDetailContext } from "../_context/UserDetailContext";
import Prompt from "../_data/Prompt";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

const LottieAnimation = dynamic(
  () => import("@/components/ui/lottie-animation"),
  { ssr: false }
);

function GenerateLogo() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const modelType = searchParams?.get("type") ?? "Default";

  const [displayCredits, setDisplayCredits] = useState(null);

  // Prevent multiple executions
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (userDetail?.credits !== undefined) {
      setDisplayCredits(userDetail.credits);
    }
  }, [userDetail?.credits]);

  // Load stored formData from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (userDetail?.email && !formData) {
      const storage = localStorage.getItem("formData");
      if (storage) {
        setFormData(JSON.parse(storage));
      }
    }
  }, [userDetail, formData]);

  // Generate AI Logo function (memoized)
  const GenerateAiLogo = useCallback(
    async (isRegeneration = false) => {
      if (!formData?.title || (hasGenerated.current && !isRegeneration)) return;

      hasGenerated.current = true; // Prevent re-execution

      if (modelType !== "Free" && userDetail?.credits < 1) {
        toast.error("Insufficient credits", {
          description: "You need at least 1 credit to generate a premium logo.",
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading(
        isRegeneration
          ? "Regenerating your logo..."
          : "Generating your logo...",
        {
          description: "This may take a moment. Please wait.",
        }
      );

      setLoading(true);

      const PROMPT = Prompt.LOGO_PROMPT.replace(
        "{logoTitle}",
        formData?.title || ""
      )
        .replace("{logoDesc}", formData?.desc || "")
        .replace("{logoColor}", formData?.palette || "")
        .replace("{logoIdea}", formData?.idea || "")
        .replace("{logoDesign}", formData?.design?.title || "")
        .replace("{logoPrompt}", formData?.design?.prompt || "");

      try {
        const result = await axios.post("/api/ai-logo-model", {
          prompt: PROMPT,
          email: userDetail?.email,
          title: formData?.title,
          desc: formData?.desc,
          type: modelType,
          userCredits: userDetail?.credits,
          isRegeneration: isRegeneration,
        });

        toast.dismiss(loadingToast);
        const imageUrl = result?.data?.imageUrl;

        if (imageUrl) {
          setLogoImage(imageUrl);
          const creditsRemaining = result?.data?.creditsRemaining;
          setDisplayCredits(creditsRemaining);
          toast.success(
            isRegeneration
              ? "Logo regenerated successfully!"
              : "Logo generated successfully!",
            {
              description: `You now have ${creditsRemaining} credits remaining.`,
            }
          );

          // Update user credits locally if it's a paid logo
          if (setUserDetail) {
            setUserDetail((prev) => ({
              ...prev,
              credits: creditsRemaining,
            }));
          }
        } else {
          toast.error("Logo generation incomplete", {
            description: "We couldn't retrieve your logo. Please try again.",
          });
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Generation failed", {
          description:
            "There was a problem creating your logo. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, modelType, userDetail, setUserDetail]
  );

  // Trigger logo generation when formData is available
  useEffect(() => {
    if (formData?.title) {
      GenerateAiLogo();
    }
  }, [formData, GenerateAiLogo]);

  const handleGenerateAgain = () => {
    hasGenerated.current = false;
    setLogoImage(null);
    GenerateAiLogo(true);
  };

  const handleDownload = async () => {
    try {
      if (!logoImage) {
        toast.error("No logo available to download");
        return;
      }
      const loadingToastId = toast.loading("Preparing your download...");
      console.log("Attempting to download logo from URL:", logoImage);
      const response = await fetch(logoImage, {
        mode: "cors", // Ensure CORS is enabled
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const blob = await response.blob();
      const filename = formData?.title
        ? `${formData.title.replace(/\s+/g, "-")}.png`
        : `logo-${Date.now()}.png`;
      const FileSaver = await import("file-saver");
      FileSaver.default(blob, filename);
      toast.dismiss(loadingToastId);
      // Add a slight delay before showing the success toast
      setTimeout(() => {
        toast.success("Logo downloaded successfully!");
      }, 300);
    } catch (error) {
      console.error("Error downloading logo:", error);
      toast.dismiss();
      toast.error("Download failed", {
        description: "Failed to download the logo. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Logo Generator</h1>
        <p className="text-gray-600">
          {modelType === "Free"
            ? "Free Logo Generator"
            : "Premium Logo Generator"}
        </p>
        {userDetail?.email && (
          <p className="text-sm mt-2">
            Credits remaining:{" "}
            <span className="font-medium">
              {displayCredits ?? userDetail?.credits ?? 0}
            </span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="w-full max-w-md">
          <LottieAnimation />
          <p className="text-center mt-4 text-gray-600">
            We're crafting your perfect logo. This may take up to a minute...
          </p>
        </div>
      ) : logoImage ? (
        <div className="flex flex-col items-center w-full max-w-4xl">
          <div className="mb-6 w-full text-center">
            <h2 className="text-xl font-medium mb-3">Your Generated Logo</h2>
          </div>

          <div className="border shadow-lg rounded-lg p-8 mb-6 w-full max-w-lg flex justify-center items-center bg-white">
            <Image
              src={logoImage}
              alt="Generated logo"
              width={300}
              height={300}
              className="object-contain max-h-full rounded"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4 justify-center w-full">
            <Button
              onClick={handleDownload}
              className="px-6 py-2 bg-brand-primary hover:bg-brand-secondary"
            >
              <Download size={20} />
              Download Logo
            </Button>
            <Button
              className="px-6 py-2 "
              variant="outline"
              onClick={handleGenerateAgain}
            >
              <RotateCcw size={20} />
              Generate Again
            </Button>
          </div>

          {formData && (
            <div className="mt-8 w-full p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium mb-2">Logo Settings</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <span className="font-medium">Title:</span> {formData.title}
                </li>
                <li>
                  <span className="font-medium">Description:</span>{" "}
                  {formData.desc || "N/A"}
                </li>
                <li>
                  <span className="font-medium">Color Palette:</span>{" "}
                  {formData.palette || "Default"}
                </li>
                <li>
                  <span className="font-medium">Style:</span>{" "}
                  {formData.design?.title || "Standard"}
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Preparing to generate your logo...</p>
          {!formData?.title && (
            <p className="text-amber-600 mt-2">Missing logo information</p>
          )}
        </div>
      )}
    </div>
  );
}

export default GenerateLogo;
