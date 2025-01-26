import {getGroqResponse, systemMessage, userMessage} from "../../groq/groq-api";
import {FILTER_INTERPRETER_DEFINITION_PROMPT} from "../prompts";
import {extractJsonFromString} from "../../utils/object-utils";

export const FilterAgent = {
    name: "filterAgent",
    description: "Interprets user requests to update the filter settings and returns a response.",
    getResponse: async (body: any) => {
        const currentFilter = body.currentFilter;
        const prompt = body.prompt;
        const history = body.history || [];
        const fullHistory = [
            systemMessage(FILTER_INTERPRETER_DEFINITION_PROMPT),
            ...history,
            userMessage("Current filter settings: \n" + JSON.stringify(currentFilter))]

        const answer = await getGroqResponse(prompt, fullHistory);
        let response = {}
        if (answer?.response) {
            try {
                response = extractJsonFromString(answer.response.replace('\n', '').trim());
            } catch (e) {
                console.error(e);
                response = answer.response
            }
        }
        return response;
    }
}