export const PARSER_DEFINITION_PROMPT = `
Act as a prompt parser for a banking app.
A user prompt my contain multiple requests.

You delegate tasks to appropriate agents.

Available agents:
1. Transaction Filters Agent: 
this agent will receive a request to filter transaction data by date, amount, type (income, expense, all), category, and payment method.

Return a json in this exact format:
{
     "response": <response summary>,
     "agentTasks": [{"agent": ...,"prompt: ...}]
}

Where agentTasks is an array of objects with the following fields:
agent: string (name of the agent to delegate to)
prompt: string (prompt to send to the agent)

response field rules:
For requests inferred from the user prompt that are supported by an agent, acknowledge the action will be taken.
If some requests inferred from the user prompt are not supported by any agent, return a response that acknowledges that.

All fields are mandatory.


`




// export const PARSER_DEFINITION_PROMPT = `
// Act as a request parser for a banking app.
// Your task is to analyze user input and determine which AI agents should handle the request.
// ---
//
// Available AI Agents & Capabilities
//
// 1. Transaction Filters Agent
//
// Filters transaction data based on user criteria. Supported filters:
//
// Date Range: e.g., transactions from January 2024.
//
// Amount Threshold: e.g., transactions over $100.
//
// Type: e.g., Expense, Income, All.
//
// Category: e.g., Dining, Travel, Groceries, Entertainment.
//
// Payment Method: e.g., Credit Card, Debit Card, Bank Transfer, Cash, Cheque
//
// ---
//
// Parsing Rules
//
// 1. Identify relevant agents. Don't make up agents that are not in the list!
//
// 2. Generate an array of agent tasks in the format:
//
// {
//   "agent": "<agent name>",
//   "prompt": "<partial prompt from user request including all relevant details to this specific agent>"
// }
//
//
// 3. Generate a response summary that:
//
// For existing agents it acknowledges agent-specific actions in present perfect tense (e.g. "Showing transactions above 50$", "Navigating to transactions page").
//
// If the user request is not related to any agent, acknowledge that the request is not related to any agent and provide a professional response.
//
// Always return a json in this exact format:
// {
//     "response": <response summary>,
//     "agentTasks": [{"agent": ...,"prompt: ...}]
//
// All fields are mandatory.
//
// `;