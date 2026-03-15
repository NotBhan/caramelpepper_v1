
#include "ai/InferenceFactory.hpp"
#include "engines/OpenAIEngine.cpp" // [UPDATE]: Included implementation for factory linkage
#include "engines/AnthropicEngine.cpp"
#include "engines/GeminiEngine.cpp"
#include "LocalLlamaEngine.cpp"

namespace CaramelPepper::AI {

std::unique_ptr<IInferenceEngine> InferenceFactory::create(const std::string& provider, const std::string& apiKey) {
    if (provider == "openai") {
        return std::make_unique<OpenAIEngine>(apiKey); // [UPDATE]: Instantiated OpenAI engine via factory
    } else if (provider == "anthropic" || provider == "claude") {
        return std::make_unique<AnthropicEngine>(apiKey); // [UPDATE]: Instantiated Anthropic engine via factory
    } else if (provider == "gemini") {
        return std::make_unique<GeminiEngine>(apiKey); // [UPDATE]: Instantiated Gemini engine via factory
    } else {
        return std::make_unique<LocalLlamaEngine>(); // [UPDATE]: Default to local llama.cpp engine
    }
}

} // namespace CaramelPepper::AI
