import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from "../ai/types"
import dotenv from 'dotenv';

dotenv.config();

export class GeminiAgent {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private systemInstructions: string;

    constructor() {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        
        this.genAI = new GoogleGenerativeAI(key);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        this.systemInstructions = "You are a helpful assistant.";
    }

    setSystemInstructions(instructions: string) {
        this.systemInstructions = instructions;
    }

    async getResponse(messages: ChatMessage | ChatMessage[]): Promise<string> {
        try {
            const formattedContents = this.formatMessages(messages);
            const result = await this.model.generateContent({
                contents: formattedContents,
                systemInstruction: this.systemInstructions
            });

            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    private formatMessages(messages: ChatMessage | ChatMessage[]) {
        if (Array.isArray(messages)) {
            return messages.map(message => ({
                role: message.role,
                parts: [{ text: message.content }]
            }));
        }
        
        return {
            role: messages.role,
            parts: [{ text: messages.content }]
        };
    }

    async startChat() {
        return this.model.startChat({
            systemInstruction: this.systemInstructions
        });
    }
}