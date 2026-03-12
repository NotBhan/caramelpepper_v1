'use server';
/**
 * @fileOverview A Genkit flow for analyzing the coding style of a given code snippet.
 *
 * - analyzeCodeStyle - A function that handles the code style analysis process.
 * - CodeStyleInput - The input type for the analyzeCodeStyle function.
 * - CodeStyleOutput - The return type for the analyzeCodeStyle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CodeStyleInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze for style.'),
});
export type CodeStyleInput = z.infer<typeof CodeStyleInputSchema>;

const CodeStyleOutputSchema = z.object({
  namingConvention: z.string().describe('Detected naming convention (e.g., camelCase, snake_case, PascalCase, kebab-case for variables, functions, classes).'),
  indentation: z.string().describe('Detected indentation style (e.g., "2 spaces", "4 spaces", "tabs").'),
  lineEnding: z.string().describe('Detected line ending style (e.g., "LF", "CRLF").'),
  braceStyle: z.string().describe('Detected brace style (e.g., "Allman", "K&R", "Stroustrup").'),
  quoteStyle: z.string().describe('Detected quote style for strings (e.g., "single", "double").'),
  maxLineLength: z.number().describe('Detected maximum line length preference (e.g., 80, 120).').optional(),
  commentStyle: z.string().describe('Detected comment style (e.g., "javadoc", "block", "line").').optional(),
  customRules: z.array(z.string()).describe('Any other specific formatting rules or patterns observed.').optional(),
});
export type CodeStyleOutput = z.infer<typeof CodeStyleOutputSchema>;

export async function analyzeCodeStyle(input: CodeStyleInput): Promise<CodeStyleOutput> {
  return codeStyleAlignmentFlow(input);
}

const codeStyleAnalysisPrompt = ai.definePrompt({
  name: 'codeStyleAnalysisPrompt',
  input: { schema: CodeStyleInputSchema },
  output: { schema: CodeStyleOutputSchema },
  prompt: `You are an expert code style analyzer. Your task is to analyze the provided code snippet and identify its coding style, including naming conventions, indentation, and formatting rules.

Carefully examine the following code and output a JSON object representing its style.
Consider the following aspects:
- Naming Convention (e.g., camelCase, snake_case, PascalCase, kebab-case for variables, functions, classes)
- Indentation style (e.g., "2 spaces", "4 spaces", "tabs")
- Line Ending (e.g., "LF", "CRLF")
- Brace Style (e.g., "Allman", "K&R", "Stroustrup")
- Quote Style for strings (e.g., "single", "double")
- Maximum Line Length preference (if discernible)
- Comment Style (e.g., Javadoc, block comments, single-line comments)
- Any other specific formatting rules or patterns observed.

Here is the code to analyze:
\`\`\`
{{{code}}}
\`\`\``,
});

const codeStyleAlignmentFlow = ai.defineFlow(
  {
    name: 'codeStyleAlignmentFlow',
    inputSchema: CodeStyleInputSchema,
    outputSchema: CodeStyleOutputSchema,
  },
  async (input) => {
    const { output } = await codeStyleAnalysisPrompt(input);
    return output!;
  }
);
