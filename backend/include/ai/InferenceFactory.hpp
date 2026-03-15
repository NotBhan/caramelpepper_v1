
#pragma once

#include "IInferenceEngine.hpp"
#include <memory>
#include <string>

namespace CaramelPepper::AI {

/**
 * @class InferenceFactory
 * @brief Static factory for instantiating AI inference engines.
 */
class InferenceFactory {
public:
    /**
     * Creates an instance of an inference engine based on provider name.
     * @param provider The provider string ("local", "openai", "anthropic", "gemini").
     * @param apiKey The secret key for cloud-based providers.
     */
    static std::unique_ptr<IInferenceEngine> create(const std::string& provider, const std::string& apiKey);
};

} // namespace CaramelPepper::AI
