import dotenv from "dotenv";
import Configuration from "openai";
import OpenAi from "openai";
import OpenAI from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Example usage
export async function getCompletion(prompt: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
        });
        const answer = response.choices[0].message.content
        console.log(answer);
        return answer;
    } catch (error) {
        console.error("Error with OpenAI API request:", error);
    }
}

// getCompletion("Hello, OpenAI!");
