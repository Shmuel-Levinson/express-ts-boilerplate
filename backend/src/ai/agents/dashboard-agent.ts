import {getGroqResponse, systemMessage, userMessage} from "../../groq/groq-api";
import {NAVIGATION_AGENT_DEFINITION_PROMPT} from "./navigaion-definition-prompt";
import {extractJsonFromString} from "../../utils/object-utils";

const DASHBOARD_AGENT_DEFINITION_PROMPT = `
    Act as a dashboard agent for a banking app.
    You are responsible for modifying the dashboard.
    Modifications include: moving widgets around, adding widgets, removing widgets, changing widget properties.
    You will receive:
        1) A user prompt, which is a request to modify the dashboard.
        2) The current dashboard state, which is the dashboard the user is modifying.
    Return a valid JSON in this exact format:
        {
            "response": ..., [mandatory!]
            "dashboardState": ... [mandatory! can be empty array]
        }
        Note that "response" and "dashboardState" are mandatory fields!
    - 'response' is a simple notification that the modification was successful or 
       a notification that the modification was unsuccessful.
    - 'dashboardState' is the new dashboard state which is an array of objects with the following structure:
    {
            id: string,
            type: 'bar-graph' | 'pie-chart' | 'text',
            gridArea: 'x / y',
            name: string,
            color: string,
            groupBy: 'paymentMethod' | 'category' | 'type',
            data?: {text: string},
    },
    - 'type' is the type of the widget. Can be "text", "pie-chart", "bar-graph".
    - 'data' is mandatory only for text widgets and should contain a 'text' field.
    - 'gridArea' is the position of the widget on the dashboard in the format 'row / col' and they can have values 1 or 2.
    - 'groupBy' is the field to group the data by. Can be "paymentMethod", "category", "type".
    
    If the user asks to add a widget without specifying position, add it to the end of the dashboard.
    Only modify the fields that are explicitly mentioned in the request.
    Default color for new widgets is #FEFEFE.
    If the user wants to move something 'up' or 'down', change the row in the gridArea by 1.
    If the user wants to move something 'left' or 'right', change the column in the gridArea by 1.
`

export const DashboardAgent = {
    name: "Dashboard Agent",
    description: "Allows modifying the dashboard",

    getResponse: async ({prompt, context}: {prompt: string, context: any}): Promise<any> => {

        const fullHistory = [
            systemMessage(DASHBOARD_AGENT_DEFINITION_PROMPT),
            userMessage("Current Dashboard state is:\n" + JSON.stringify(context.dashboardState))]

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