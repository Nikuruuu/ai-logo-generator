const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AiDesignIdea = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Based on Logo of type Modern Mascot Logo Generate a text prompt to create Logo for Logo title/Brand name : Boneless Chicken with description: fried boneless chicken with different flavor  and referring to prompt: A vibrant logo featuring a friendly, animated character with a playful expression. The character is dressed in a classic uniform, complete with a distinctive accessory that adds personality. In one hand, they hold a signature item that represents the brand, while the other elements of the design—such as small decorative touches or natural accents—enhance the overall look. The background consists of a bold, circular design with subtle accents to highlight the character. Below, the brand name is displayed in bold, stylized lettering, with a slight curve and complementary decorative lines. The overall style is fun, welcoming, and full of character. Give me 4/5 Suggestion of logo idea (each idea with maximum 4-5 words), Result in JSON format with ideas field only",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: 'Okay, here are five logo ideas in JSON format, based on your request for a modern mascot logo for "Boneless Chicken" featuring fried boneless chicken with different flavors, and inspired by the example prompt:\n\n```json\n{\n  "ideas": [\n    "Chef Chicken with Flavor Bites",\n    "Boneless Chicken Flavor Explosion",\n    "Happy Chicken Flavor Burst",\n    "Fried Chicken Superhero Mascot",\n    "Boneless Buddy with Flavor!"\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const AiLogoPrompt = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a text prompt to create Logo for Logo Title/Brand name : asdada,with description: asdasd, with Color combination of Rustic Elegance, also include the 'asdada' Character with Accessory and include Modern Mascot Logos design idea and Referring to this Logo Prompt:A vibrant logo featuring a friendly, animated character with a playful expression. The character is dressed in a classic uniform, complete with a distinctive accessory that adds personality. In one hand, they hold a signature item that represents the brand, while the other elements of the design—such as small decorative touches or natural accents—enhance the overall look. The background consists of a bold, circular design with subtle accents to highlight the character. Below, the brand name is displayed in bold, stylized lettering, with a slight curve and complementary decorative lines. The overall style is fun, welcoming, and full of character.  Give me result in JSON portal with prompt field only\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "```json\n{\n  \"prompt\": \"Create a modern mascot logo for the brand 'asdada'. The logo should embody a 'Rustic Elegance' color combination. Feature an 'asdada' character with a distinctive accessory, designed with a playful and welcoming expression. The character should hold a signature item representing the brand. Incorporate a bold, circular background with subtle accents to highlight the character. The brand name 'asdada' should be displayed below in bold, stylized lettering with a slight curve and complementary decorative lines. The overall style should be fun, approachable, and full of character, drawing inspiration from vibrant and animated mascot designs.\"\n}\n```\n",
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
