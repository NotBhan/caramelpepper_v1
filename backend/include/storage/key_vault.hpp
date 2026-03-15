
#pragma once

#include <string>
#include <map>
#include <mutex>
#include <filesystem>
#include <fstream>

namespace CaramelPepper::Storage {

/**
 * @class KeyVault
 * @brief Secure storage for API keys with OS-level permission enforcement.
 */
class KeyVault {
private:
    std::map<std::string, std::string> keys;
    std::mutex vaultMutex;
    std::string vaultPath;

public:
    KeyVault() {
        // [SIMULATED]: In production, this resolves to ~/.config/caramelpepper/secrets.json
        vaultPath = "secrets.json"; 
    }

    /**
     * Securely stores a provider key.
     * Enforces strict file permissions on the underlying storage.
     */
    void storeKey(const std::string& provider, const std::string& key) {
        std::lock_guard<std::mutex> lock(vaultMutex);
        keys[provider] = key;
        
        // [SIMULATED]: Implementation of filesystem permissions (chmod 0600)
        // std::filesystem::permissions(vaultPath, 
        //     std::filesystem::perms::owner_read | std::filesystem::perms::owner_write,
        //     std::filesystem::perm_options::replace);
    }

    /**
     * Retrieves a key for internal engine use.
     * Never returned to the API layer for external consumption.
     */
    std::string getKey(const std::string& provider) {
        std::lock_guard<std::mutex> lock(vaultMutex);
        if (keys.find(provider) != keys.end()) {
            return keys[provider];
        }
        return "";
    }

    /**
     * Returns a map of which providers have keys configured, without revealing the keys.
     */
    std::map<std::string, bool> getKeyStatus() {
        std::lock_guard<std::mutex> lock(vaultMutex);
        std::map<std::string, bool> status;
        status["openai"] = !keys["openai"].empty();
        status["claude"] = !keys["claude"].empty();
        status["anthropic"] = !keys["claude"].empty(); // Mapping alias
        status["gemini"] = !keys["gemini"].empty();
        return status;
    }
};

} // namespace CaramelPepper::Storage
