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
        << "2. VERTICAL PACING: You MUST maintain the exact vertical pacing of the original code. Do not remove empty lines, and preserve all original paragraphing and structural spacing.\n"
        << "3. LINE MARKING: For every single line modified or optimized, append an inline comment at the exact end of that line using the format: `// [UPDATE]: <reason>`. Do not touch lines that do not need optimization.\n\n"
        << "### PROJECT STYLE RULES ###\n"
        << styleRules << "\n\n"
        << "### REPOSITORY CONTEXT (RAG) ###\n"
        << ragContext << "\n\n"
        << "### SOURCE CODE TO REFACTOR ###\n"
        << originalCode;

    return oss.str();
}

} // namespace CaramelPepper::AI
