import React, { useEffect, useState } from "react";
import HeadingDescription from "./HeadingDescription";
import Lookup from "@/app/_data/Lookup";
import Prompt from "@/app/_data/Prompt";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

function LogoIdea({ onHandleInputChange, formData }) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState();
  const [selectedOption, setSelectedOption] = useState(formData?.idea);
  useEffect(() => {
    generateLogoDesignIdea();
  }, []);

  const generateLogoDesignIdea = async () => {
    setLoading(true);

    const PROMPT = Prompt.DESIGN_IDEA_PROMPT.replace(
      "{logoType}",
      formData?.design?.title || ""
    )
      .replace("{logoTitle}", formData?.title || "")
      .replace("{logoDesc}", formData?.desc || "")
      .replace("{logoPrompt}", formData?.design?.prompt || "");

    const result = await axios.post("/api/ai-design-ideas", {
      prompt: PROMPT,
    });

    setIdeas(result.data.ideas);
    setLoading(false);
  };
  return (
    <div className="my-10">
      <HeadingDescription
        title={Lookup.LogoIdeaTitle}
        description={Lookup.LogoIdeaDesc}
      />
      <div className="flex items-center justify-center ">
        {loading && <Loader2Icon className="animate-spin my-10" />}
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
        {ideas &&
          ideas.map((item, index) => (
            <h2
              key={index}
              onClick={() => {
                setSelectedOption(item);

                onHandleInputChange(item);
              }}
              className={`p-2 rounded-lg border px-3 cursor-pointer hover:ring-2 ring-brand-primary ${
                selectedOption == item && "ring-2 ring-brand-primary"
              }`}
            >
              {item}
            </h2>
          ))}
      </div>
    </div>
  );
}

export default LogoIdea;
