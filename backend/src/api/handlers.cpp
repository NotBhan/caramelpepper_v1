
#include "ai/prompt_templates.hpp"
#include "ai/InferenceFactory.hpp"
#include "storage/key_vault.hpp"
#include <memory>
#include <map>

/**
 * @file handlers.cpp
 * @brief Backend API handlers with integrated KeyVault for secure credential management.
 */

namespace CaramelPepper::API {

// Global vault instance for the local desktop process
static CaramelPepper::Storage::KeyVault globalVault;

struct RefactorRequest {
    std::string code;
    std::string engineType; 
};

struct KeyStorageRequest {
    std::string provider;
    std::string key;
};

/**
 * Handles the POST /settings/keys endpoint.
 * Persists the key to the secure vault and returns success.
 */
bool handleStoreKey(const KeyStorageRequest& req) {
    if (req.provider.empty() || req.key.empty()) return false;
    globalVault.storeKey(req.provider, req.key);
    return true;
}

/**
 * Handles the GET /settings/keys/status endpoint.
 * Returns which providers are configured without exposing plaintext keys.
 */
std::map<std::string, bool> handleGetKeyStatus() {
    return globalVault.getKeyStatus();
}

/**
 * Updated POST /refactor handler.
 * Fetches API keys directly from the vault rather than the network payload.
 */
std::string handleRefactorRequest(const RefactorRequest& req) {
    std::string prompt = CaramelPepper::AI::buildPrompt(
        req.code, 
        "naming: camelCase, indent: 2 spaces", 
        "project: nextjs-react-v1"
    );

    // Retrieve key from internal vault (never logged)
    std::string apiKey = (req.engineType == "local") ? "" : globalVault.getKey(req.engineType);

    if (req.engineType != "local" && apiKey.empty()) {
        return "ERROR: Provider " + req.engineType + " is not configured in the vault.";
    }

    auto engine = CaramelPepper::AI::InferenceFactory::create(req.engineType, apiKey);

    if (engine) {
        return engine->generateRefactor(prompt);
    }

    return "ERROR: Engine instantiation failed.";
}

} // namespace CaramelPepper::API
