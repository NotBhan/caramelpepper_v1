#include "ai/InferenceFactory.hpp"
#include "engines/OpenAIEngine.cpp"
#include "engines/AnthropicEngine.cpp"
#include "engines/GeminiEngine.cpp"
#include "LocalLlamaEngine.cpp"

namespace CaramelPepper::AI {

std::unique_ptr<IInferenceEngine> InferenceFactory::create(const std::string& provider, const std::string& apiKey) {
    if (provider == "openai") {
        return std::make_unique<OpenAIEngine>(apiKey);
    } else if (provider == "anthropic" || provider == "claude") {
        return std::make_unique<AnthropicEngine>(apiKey);
    } else if (provider == "gemini") {
        return std::make_unique<GeminiEngine>(apiKey);
    } else {
        return std::make_unique<LocalLlamaEngine>();
    }
}

} // namespace CaramelPepper::AI
