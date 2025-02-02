import {getGroqResponse, systemMessage, userMessage} from "../../groq/groq-api";
import {PARSER_DEFINITION_PROMPT} from "./parser-definition-prompt";
import {extractJsonFromString} from "../../utils/object-utils";

export const ParserAgent = {
    name: "parserAgent",
    description: "Parses user prompt and delegates to the appropriate agents.",
    getResponse: async (body: any): Promise<{ response: string, agents: string[] }> => {
        const prompt = body.prompt;
        const context = body.context;
        const history = body.history || [];
        const fullHistory = [
            systemMessage(PARSER_DEFINITION_PROMPT),
            ...history,
            userMessage("User prompt is: \n" + JSON.stringify(prompt))]
        const answer = await getGroqResponse(prompt, fullHistory);
        let response : { response: string, agents: string[] };
        if (answer?.response) {
            try {
                response = extractJsonFromString(answer.response.replace('\n', '').trim()) as { response: string, agents: string[] }
            } catch (e) {
                console.error(e);
                response = { response: answer.response, agents: [] }
            }
        } else {
            response = { response: "No response found in LLM answer", agents: [] }
        }
        return response;
    }
}