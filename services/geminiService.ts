
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure API_KEY is accessed correctly from environment variables
// This app assumes process.env.API_KEY is set in the environment where it runs.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY not found. Please set the API_KEY environment variable.");
  // In a real app, you might want to prevent initialization or show a persistent error.
}
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" }); // Fallback to prevent crash if key is missing during dev

const SYSTEM_INSTRUCTION_TEXT_STANDARD = `You are an expert LaTeX editor specializing in mathematical and scientific texts.
Your goal is to refine rough LaTeX input into polished, grammatically correct, and semantically accurate LaTeX code.
Focus on precision and adherence to LaTeX conventions.
Output ONLY the corrected LaTeX code block. Do not add any conversational text, explanations, apologies, or markdown formatting like \`\`\`latex ... \`\`\` or \`\`\` ... \`\`\` around the LaTeX code itself.
Ensure all mathematical environments, symbols, and commands are correctly formatted and preserved. If asked to modify a specific selection, ensure only that selection is changed contextually within the larger document.`;

const SYSTEM_INSTRUCTION_FOR_IMAGE_EXTRACTION = `You are an expert LaTeX editor specializing in extracting and transcribing mathematical and scientific content from images.
Your task is to analyze the provided image, identify any mathematical equations, formulas, or relevant text, and convert it into polished, grammatically correct, and semantically accurate LaTeX code.
Focus on precision in transcribing symbols, structures (like fractions, matrices, integrals), and layouts.
Output ONLY the LaTeX code block representing the content from the image. Do not add any conversational text, explanations, apologies, or markdown formatting like \`\`\`latex ... \`\`\` or \`\`\` ... \`\`\` around the LaTeX code itself.
If multiple distinct LaTeX blocks are identified, present them sequentially.`;


const cleanGeminiResponseText = (text: string): string => {
  let cleanedText = text.trim();
  const fenceRegex = /^```(?:latex)?\s*\n?(.*?)\n?\s*```$/s;
  const match = cleanedText.match(fenceRegex);
  if (match && match[1]) {
    cleanedText = match[1].trim();
  }
  return cleanedText;
};

async function correctLatex(roughText: string, modelName: string): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please contact support or check your setup.");
  }
  
  try {
    const prompt = `Refine the following LaTeX text. Correct grammar, enhance clarity, and ensure it's valid LaTeX. Preserve all mathematical content and structure.

Original LaTeX:
---
${roughText}
---

Corrected LaTeX:`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEXT_STANDARD,
        temperature: 0.3, 
        topK: 32,
        topP: 0.9,
      }
    });
    
    return cleanGeminiResponseText(response.text);

  } catch (error: unknown) {
    console.error("Error calling Gemini API for correction:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("The provided API key is invalid. Please check your API key configuration.");
        }
         throw new Error(`Failed to process LaTeX with Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service for correction.");
  }
}

async function refineLatexWithPrompt(
  currentLatex: string, 
  userPrompt: string, 
  selectedText: string | undefined, 
  modelName: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please contact support or check your setup.");
  }

  let promptContent;
  if (selectedText && selectedText.trim() !== "") {
    promptContent = `The user wants to refine a specific part of their LaTeX document.
User's instruction: "${userPrompt}"
The text to refine is:
---
${selectedText}
---
This selection is part of the following full LaTeX document:
---
${currentLatex}
---
Modify ONLY the selected text based on the user's instruction, ensuring it fits correctly back into the overall document.
Output the ENTIRE LaTeX document with the refined selection.
Your output must be ONLY the complete, modified LaTeX code block.`;
  } else {
    promptContent = `The user wants to refine their entire LaTeX document based on the following instruction:
User's instruction: "${userPrompt}"

The LaTeX document to refine is:
---
${currentLatex}
---
Apply the instruction to the entire document.
Output the ENTIRE LaTeX document after applying the refinement.
Your output must be ONLY the complete, modified LaTeX code block.`;
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: promptContent,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEXT_STANDARD,
        temperature: 0.4, 
        topK: 40,
        topP: 0.9,
      }
    });

    return cleanGeminiResponseText(response.text);

  } catch (error: unknown) {
    console.error("Error calling Gemini API for refinement:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("The provided API key is invalid. Please check your API key configuration.");
        }
         throw new Error(`Failed to refine LaTeX with Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service for refinement.");
  }
}

async function extractLatexFromImage(
  base64ImageData: string,
  mimeType: string,
  modelName: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is not configured. Please contact support or check your setup.");
  }

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };

  const textPart = {
    text: "Extract any mathematical equations, formulas, or relevant text from this image and provide the corresponding polished LaTeX code. Ensure accuracy for mathematical symbols and structures. Output ONLY the LaTeX code block."
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName, // Ensure this model supports multimodal input
      contents: { parts: [textPart, imagePart] }, // Order: text prompt first, then image
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_FOR_IMAGE_EXTRACTION,
        temperature: 0.2, // Lower temperature for more deterministic extraction
        topK: 32,
        topP: 0.85,
      }
    });
    
    return cleanGeminiResponseText(response.text);

  } catch (error: unknown) {
    console.error("Error calling Gemini API for image extraction:", error);
     if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("The provided API key is invalid. Please check your API key configuration.");
        }
         // Check for more specific multimodal errors if the SDK provides them
        if (error.message.includes("Unsupported MimeType")) { // Example
            throw new Error(`The image format (${mimeType}) is not supported by the AI service.`);
        }
        throw new Error(`Failed to extract LaTeX from image with Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service for image extraction.");
  }
}


export const geminiService = {
  correctLatex,
  refineLatexWithPrompt,
  extractLatexFromImage,
};
