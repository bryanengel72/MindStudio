import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AGENTS } from '../constants';

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    // Fallback for demo purposes if API_KEY is not set in environment
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.warn("Gemini API Key is missing. Chat features may not work.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const initializeChat = async (): Promise<void> => {
  const client = getAIClient();
  
  // Prepare context about the portfolio
  const portfolioContext = AGENTS.map(a => 
    `- Name: ${a.title} (Category: ${a.category}). Description: ${a.description}. Match: ${a.match}%.`
  ).join('\n');

  const systemInstruction = `
    You are "Agent X", the concierge for Bryan's AI Agent Portfolio. 
    Your goal is to help visitors find the right AI agent for their needs from the provided list.
    
    Here is the list of available agents in the portfolio:
    ${portfolioContext}

    Rules:
    1. Be concise, witty, and helpful.
    2. If asked about an agent not on the list, politely say it's not in the portfolio yet but maybe Bryan should build it.
    3. Use a tone similar to a high-tech futuristic interface.
    4. Keep responses under 100 words.
  `;

  try {
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    // We continue; error handling will happen when sending messages
  }
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<string>> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    // Return an async iterable that yields text chunks
    return {
      [Symbol.asyncIterator]: async function* () {
        for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                yield c.text;
            }
        }
      }
    };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};