#include "ai/prompt_templates.hpp"
#include "ai/InferenceFactory.hpp"
#include <memory>

/**
 * @file handlers.cpp
 * @brief Mock API handlers for the CaramelPepper C++ backend.
 */

namespace CaramelPepper::API {

struct RefactorRequest {
    std::string code;
    std::string engineType; // "local", "claude", "openai", "gemini"
    std::string apiKey;
};

/**
 * Handles the POST /refactor endpoint.
 */
std::string handleRefactorRequest(const RefactorRequest& req) {
    // 1. Construct the prompt using the template engine
    std::string prompt = CaramelPepper::AI::buildPrompt(
        req.code, 
        "naming: camelCase, indent: 2 spaces", 
        "project: nextjs-react-v1"
    );

    // 2. Instantiate the appropriate engine via the Factory
    auto engine = CaramelPepper::AI::InferenceFactory::create(req.engineType, req.apiKey);

    // 3. Perform inference and return result
    if (engine) {
        return engine->generateRefactor(prompt);
    }

    return "ERROR: Engine instantiation failed.";
}

} // namespace CaramelPepper::API
