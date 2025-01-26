import {getGroqResponse, systemMessage, userMessage} from "../../groq/groq-api";
import {FILTER_INTERPRETER_DEFINITION_PROMPT} from "../prompts";
import {extractJsonFromString} from "../../utils/object-utils";
import {NAVIGATION_AGENT_DEFINITION_PROMPT} from "./navigaion-definition-prompt";

export const NavigationAgent = {
    name: "Navigation Agent",
    description: "Navigates to pages in the app.",

    getResponse: async ({prompt, currentPage}: {prompt: string, currentPage: any}): Promise<any> => {

        const fullHistory = [
            systemMessage(NAVIGATION_AGENT_DEFINITION_PROMPT),
            userMessage("Current page is: \n" + currentPage)]

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