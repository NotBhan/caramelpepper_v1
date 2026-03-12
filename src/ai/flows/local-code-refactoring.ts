'use server';
/**
 * @fileOverview A Genkit flow for analyzing code complexity and generating context-aware refactoring suggestions.
 *
 * - localCodeRefactoring - A function that handles the code refactoring suggestion process.
 * - LocalCodeRefactoringInput - The input type for the localCodeRefactoring function.
 * - LocalCodeRefactoringOutput - The return type for the localCodeRefactoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the localCodeRefactoring flow.
 * @property {string} code - The code snippet or file content to be analyzed for refactoring suggestions.
 * @property {string} [language] - The programming language of the code (e.g., "typescript", "javascript", "python").
 */
const LocalCodeRefactoringInputSchema = z.object({
  code: z.string().describe('The code snippet or file content to be analyzed for refactoring suggestions.'),
  language: z.string().optional().describe('The programming language of the code (e.g., "typescript", "javascript", "python").'),
});
export type LocalCodeRefactoringInput = z.infer<typeof LocalCodeRefactoringInputSchema>;

/**
 * Output schema for the localCodeRefactoring flow.
 * @property {string} refactoredCode - The completely refactored version of the input code, if applicable. If no full refactoring is provided, this field might be empty or the original code.
 * @property {string[]} suggestions - A list of specific, actionable refactoring suggestions to improve code quality, maintainability, or reduce complexity.
 * @property {string} complexityAnalysis - A brief analysis of the code's complexity.
 */
const LocalCodeRefactoringOutputSchema = z.object({
  refactoredCode: z.string().describe('The completely refactored version of the input code, if applicable. If no full refactoring is provided, this field might be empty or the original code.'),
  suggestions: z.array(z.string()).describe('A list of specific, actionable refactoring suggestions to improve code quality, maintainability, or reduce complexity.'),
  complexityAnalysis: z.string().describe('A brief analysis of the code\'s complexity.'),
});
export type LocalCodeRefactoringOutput = z.infer<typeof LocalCodeRefactoringOutputSchema>;

/**
 * Analyzes code and generates context-aware refactoring suggestions.
 * @param {LocalCodeRefactoringInput} input - The input containing the code to be analyzed and its language.
 * @returns {Promise<LocalCodeRefactoringOutput>} A promise that resolves to the refactoring suggestions and analysis.
 */
export async function localCodeRefactoring(input: LocalCodeRefactoringInput): Promise<LocalCodeRefactoringOutput> {
  return localCodeRefactoringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'localCodeRefactoringPrompt',
  input: {schema: LocalCodeRefactoringInputSchema},
  output: {schema: LocalCodeRefactoringOutputSchema},
  prompt: `You are an expert code refactoring assistant, specializing in improving code quality, maintainability, and reducing complexity.\nYour goal is to analyze the provided code and offer context-aware, privacy-preserving refactoring suggestions.\nFocus on identifying areas of high complexity, potential bugs, readability issues, and suggesting improvements while adhering to good coding practices.\nIf a full refactoring of the code is straightforward and significantly improves it, provide the \`refactoredCode\`. Otherwise, provide detailed \`suggestions\` and a brief \`complexityAnalysis\`.\n\nConsider the following code written in {{#if language}}{{language}}{{else}}an unspecified language{{/if}}:\n\n\`\`\`{{#if language}}{{language}}{{/if}}\n{{{code}}}\n\`\`\`\n\nPlease provide your analysis and refactoring output in the following JSON format:\n\`\`\`json\n{\n  "refactoredCode": "...",\n  "suggestions": [\n    "...",\n    "..."\n  ],\n  "complexityAnalysis": "..."\n}\n\`\`\`\n`,
});

const localCodeRefactoringFlow = ai.defineFlow(
  {
    name: 'localCodeRefactoringFlow',
    inputSchema: LocalCodeRefactoringInputSchema,
    outputSchema: LocalCodeRefactoringOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
