
#pragma once

#include <string>
#include <string_view>

namespace CaramelPepper::AI {

/**
 * @interface IInferenceEngine
 * @brief Pure virtual interface for supporting pluggable LLM backends.
 */
class IInferenceEngine {
public:
    virtual ~IInferenceEngine() = default;

    /**
     * Generates a refactored version of the provided code based on a formatted prompt.
     * @param prompt The complete system + user prompt constructed by the orchestrator.
     * @return A string containing only the optimized source code.
     */
    virtual std::string generateRefactor(std::string_view prompt) = 0;

    /**
     * Returns a human-readable identifier for the engine (e.g., "Llama-3-8B", "Claude-3.5-Sonnet").
     */
    virtual std::string getEngineName() const = 0;
};

} // namespace CaramelPepper::AI
