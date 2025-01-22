export function extractJsonFromString(input: string): Record<string, any> {
    let jsonStart = -1;
    let bracketCount = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (char === "{") {
            if (bracketCount === 0) {
                jsonStart = i; // Mark the start of a potential JSON object
            }
            bracketCount++;
        } else if (char === "}") {
            bracketCount--;
            if (bracketCount === 0 && jsonStart !== -1) {
                const jsonString = input.substring(jsonStart, i + 1);
                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    return {}; // Invalid JSON
                }
            }
        }
    }

    return {}; // No valid JSON found
}