import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, ContentPackage } from "../types";

const SYSTEM_INSTRUCTION = `
You are the core engine of an app called POST Tools.
Your job is to generate complete social media content packages based on the user's input.
You must analyze the provided reference image for visual style, colors, and mood.

Follow the specific JSON output structure strictly.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: "Short, strong and aligned with the niche." },
    copy: {
      type: Type.OBJECT,
      properties: {
        full_text: { type: Type.STRING },
        carousel: {
          type: Type.OBJECT,
          properties: {
            slide_1: { type: Type.STRING, description: "Hook" },
            slide_2: { type: Type.STRING, description: "Value" },
            slide_3: { type: Type.STRING, description: "Value" },
            slide_4: { type: Type.STRING, description: "Value" },
            slide_5: { type: Type.STRING, description: "Value" },
            cta_slide: { type: Type.STRING, description: "CTA" },
          },
        },
        reels_script: { type: Type.STRING, description: "Script, captions and timing" },
        feed_version: { type: Type.STRING, description: "Single copy with CTA" },
      },
    },
    cta: { type: Type.STRING, description: "Clear, persuasive and aligned with the niche." },
    design_guide: {
      type: Type.OBJECT,
      properties: {
        palette: { type: Type.STRING, description: "Color palette suggestions" },
        typography: { type: Type.STRING, description: "Typography direction" },
        layout: { type: Type.STRING, description: "Layout structure" },
        brand_alignment: { type: Type.STRING, description: "What elements must match the reference logo/image" },
      },
    },
    image_prompt: { type: Type.STRING, description: "Visual, Detailed, Consistent with reference, Adapted to format" },
    format_variations: {
      type: Type.OBJECT,
      properties: {
        feed: { type: Type.STRING },
        reels_story: { type: Type.STRING },
        thumbnail: { type: Type.STRING },
      },
    },
  },
  required: ["headline", "copy", "cta", "design_guide", "image_prompt", "format_variations"],
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
         // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

// Helper to get API key from various environments (Vite, Next.js, Standard Node)
const getApiKey = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return process.env.API_KEY;
};

export const generatePostContent = async (input: UserInput): Promise<ContentPackage> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_API_KEY or API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Prepare prompt
  const textPrompt = `
    GENERATE CONTENT PACKAGE:
    Niche: ${input.niche}
    Format: ${input.format}
    Topic/Text: ${input.topic}
    Style: ${input.style}
    
    Please analyze the attached image for visual direction (colors, mood, brand energy).
  `;

  const parts: any[] = [{ text: textPrompt }];

  if (input.image) {
    const imagePart = await fileToGenerativePart(input.image);
    parts.push(imagePart);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const resultText = response.text;
    if (!resultText) {
        throw new Error("No response text received");
    }
    
    return JSON.parse(resultText) as ContentPackage;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_API_KEY or API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image generated. Please try again.");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};