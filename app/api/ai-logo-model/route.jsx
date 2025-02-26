import { AiLogoPrompt } from "@/configs/AiModel";
import { db, storage } from "@/configs/FirebaseConfig";
import axios from "axios";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req) {
  try {
    const { prompt, email, title, desc, type, userCredits, isRegeneration } =
      await req.json();
    let base64ImageWithMime = "";
    let creditsToDeduct = 0;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Generate AI prompt from user input
    const AiPromptResult = await AiLogoPrompt.sendMessage(prompt);
    const AiPrompt = JSON.parse(await AiPromptResult.response.text()).prompt;
    console.log(AiPrompt);

    // Use different Replicate models or settings for Free vs Premium
    if (type === "Free") {
      // Free tier: Use a faster/simpler model configuration
      creditsToDeduct = 2; // Deduct 2 credit for free tier

      const output = await replicate.run(
        "bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad",
        {
          input: {
            prompt: AiPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "png",
            guidance_scale: 3.0,
            output_quality: 75,
            num_inference_steps: 6, // Fewer steps for free tier
          },
        }
      );
      console.log("Free tier output:", output);
      base64ImageWithMime = await ConvertImageToBase64(output[0]);
    } else {
      // Premium tier: Higher quality settings
      creditsToDeduct = 3; // Deduct 3 credits for premium tier

      const output = await replicate.run(
        "bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad",
        {
          input: {
            prompt: AiPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "png",
            guidance_scale: 3.5,
            output_quality: 90,
            num_inference_steps: 8,
          },
        }
      );
      console.log("Premium tier output:", output);
      base64ImageWithMime = await ConvertImageToBase64(output[0]);
    }

    // Check if user has enough credits before proceeding
    if (Number(userCredits) < creditsToDeduct) {
      throw new Error("Not enough credits to generate logo");
    }

    // Deduct credits for both tiers
    const docRef = doc(db, "users", email);
    await updateDoc(docRef, {
      credits: Number(userCredits) - creditsToDeduct,
    });

    // Ensure image is not empty before upload
    if (!base64ImageWithMime) {
      throw new Error("Generated image is empty or invalid.");
    }

    // Generate a unique ID for the image
    const timestamp = Date.now().toString();
    const storagePath = `users/${email}/logos/${timestamp}`;
    const storageRef = ref(storage, storagePath);

    // Upload to Firebase Storage
    await uploadString(storageRef, base64ImageWithMime, "data_url");

    // Retrieve the download URL
    const imageUrl = await getDownloadURL(storageRef);

    // Save metadata in Firestore
    await addDoc(collection(db, "users", email, "logos"), {
      image: imageUrl,
      storagePath: storagePath,
      title,
      desc,
      creditsCost: creditsToDeduct, // Record the credits spent on this logo
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      creditsRemaining: Number(userCredits) - creditsToDeduct,
      isRegeneration: isRegeneration,
    });
  } catch (e) {
    console.error("Error details:", e.message, e.response?.data);
    return NextResponse.json({
      success: false,
      error: e.message || "Unknown error",
    });
  }
}

async function ConvertImageToBase64(image) {
  try {
    const response = await axios.get(image, { responseType: "arraybuffer" });
    const base64ImageRaw = Buffer.from(response.data).toString("base64");
    return `data:image/png;base64,${base64ImageRaw}`;
  } catch (error) {
    console.error("Error converting image:", error.message);
    return null;
  }
}
