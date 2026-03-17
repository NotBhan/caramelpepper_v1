#pragma once

#include <string>
#include <string_view>
#include <sstream>

/**
 * @file prompt_templates.hpp
 * @namespace CaramelPepper::AI
 * 
 * Centralized utility for constructing system prompts for the CaramelPepper 
 * local refactoring engine. Focuses on code integrity, vertical pacing, 
 * and cognitive readability.
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
        
        << "### CRITICAL CONSTRAINT: ABSOLUTE VERTICAL PACING ###\n"
        << "1. You MUST preserve the exact vertical rhythm of the original code.\n"
        << "2. Do NOT delete empty lines between logical blocks.\n"
        << "3. If the original code has structural breathing room, your refactored code MUST maintain those exact empty lines.\n"
        << "4. Never minify or compress the code visually. Vertical pacing is a semantic requirement for readability.\n\n"
        
        << "### CRITICAL CONSTRAINT: READABILITY ENHANCEMENTS ###\n"
        << "1. Focus on reducing Cognitive Complexity.\n"
        << "2. Un-nest deep conditionals using guard clauses and early returns.\n"
        << "3. Rename cryptic variables to be highly descriptive based on their usage context.\n"
        << "4. Keep related logical operations grouped together to maintain logical cohesion.\n\n"
        
        << "### CRITICAL CONSTRAINT: AUDITABLE READABILITY ###\n"
        << "1. Every single line you alter to improve readability or logic MUST end with an inline comment: `// [REFACTORED]: <brief reason>`.\n"
        << "2. If you split a complex line into two readable lines, mark both with the justification.\n\n"
        
        << "### MANDATORY OUTPUT FORMAT ###\n"
        << "- CODE ONLY: Output ONLY valid source code.\n"
        << "- NO Markdown code blocks (e.g., no ```cpp).\n"
        << "- NO preamble, conversational text, or postamble.\n\n"
        
        << "### PROJECT STYLE RULES ###\n"
        << styleRules << "\n\n"
        << "### REPOSITORY CONTEXT (RAG) ###\n"
        << ragContext << "\n\n"
        << "### SOURCE CODE TO REFACTOR ###\n"
        << originalCode;

    return oss.str();
}

} // namespace CaramelPepper::AI
