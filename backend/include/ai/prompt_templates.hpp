#pragma once

#include <string>
#include <string_view>
#include <sstream>

/**
 * @file prompt_templates.hpp
 * @namespace CaramelPepper::AI
 * 
 * Centralized utility for constructing system prompts for the CaramelPepper 
 * local refactoring engine. Focuses on code integrity and clean diff generation.
 */

namespace CaramelPepper::AI {

/**
 * Constructs a structured system prompt for a local LLM to perform refactoring.
 * 
 * @param originalCode The raw source code to be analyzed and modified.
 * @param styleRules Formatting and naming rules detected by the style engine.
 * @param ragContext Supplemental information from the project's local context.
 * @return A formatted string with explicit instructions for the LLM.
 */
inline std::string buildPrompt(
    std::string_view originalCode, 
    std::string_view styleRules, 
    std::string_view ragContext
) {
    std::ostringstream oss;

    oss << "### SYSTEM ROLE ###\n"
        << "You are the CaramelPepper 🌶️🍬 local AI refactoring engine. Your output is consumed directly by a code diffing tool.\n\n"
        << "### MANDATORY BEHAVIORAL CONSTRAINTS ###\n"
        << "1. CODE ONLY: Output ONLY valid source code. No conversational text, no markdown code blocks (e.g., no ```cpp), and no preamble/postamble.\n"
        << "2. CRITICAL CONSTRAINT: You are a strict code formatter. You MUST preserve 100% of the original vertical spacing. "
        << "If the original code has an empty line between two variable declarations, your output MUST have an empty line in the exact same place. "
        << "Do not compress or minify the code. Failure to preserve original blank lines is a critical failure.\n"
        << "3. ZERO-TOLERANCE VERTICAL PACING: You MUST maintain the exact vertical pacing, blank lines, and original paragraphing of the source code. "
        << "Do not remove empty lines, and preserve all structural indentation. Structural spacing is a semantic requirement.\n"
        << "4. LINE MARKING: For every single line modified or optimized, append an inline comment at the exact end of that line using the format: `// [UPDATE]: <reason>`. Do not touch lines that do not need optimization.\n\n"
        << "### EXAMPLE (VERIFICATION OF VERTICAL INTEGRITY) ###\n"
        << "INPUT SOURCE:\n"
        << "const x = 10;\n"
        << "\n"
        << "const y = 20;\n"
        << "\n"
        << "EXPECTED OUTPUT:\n"
        << "const x = 10;\n"
        << "\n"
        << "const y = 20;\n"
        << "\n"
        << "### PROJECT STYLE RULES ###\n"
        << styleRules << "\n\n"
        << "### REPOSITORY CONTEXT (RAG) ###\n"
        << ragContext << "\n\n"
        << "### SOURCE CODE TO REFACTOR ###\n"
        << originalCode;

    return oss.str();
}

} // namespace CaramelPepper::AI