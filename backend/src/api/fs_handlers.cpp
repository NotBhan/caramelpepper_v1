
#include <filesystem>
#include <fstream>
#include <string>
#include <vector>
#include <set>
#include <algorithm>
#include "nlohmann/json.hpp"

/**
 * @file fs_handlers.cpp
 * @brief Filesystem API handlers for workspace navigation and file reading.
 */

namespace CaramelPepper::API {

namespace fs = std::filesystem;
using json = nlohmann::json;

const std::set<std::string> IGNORE_LIST = {".git", "node_modules", "build", ".gguf", ".next", "out"};

/**
 * Recursively builds a JSON directory tree.
 * Metadata only; does not read file contents.
 */
json buildTree(const fs::path& path) {
    json result = json::array();
    
    try {
        for (const auto& entry : fs::directory_iterator(path)) {
            std::string name = entry.path().filename().string();
            
            // Skip ignored patterns
            if (IGNORE_LIST.find(name) != IGNORE_LIST.end()) continue;

            json item;
            item["name"] = name;
            item["path"] = entry.path().string();
            item["is_dir"] = entry.is_directory();

            if (entry.is_directory()) {
                item["children"] = buildTree(entry.path());
            }

            result.push_back(item);
        }
    } catch (const fs::filesystem_error& e) {
        // Silently handle inaccessible directories
    }

    // Sort: Directories first, then alphabetical
    std::sort(result.begin(), result.end(), [](const json& a, const json& b) {
        if (a["is_dir"] != b["is_dir"]) return a["is_dir"].get<bool>();
        return a["name"].get<std::string>() < b["name"].get<std::string>();
    });

    return result;
}

/**
 * Handler for GET /api/workspace/tree
 */
std::string handleGetWorkspaceTree() {
    // [SIMULATED]: In a real local desktop app, this is the CWD or project root
    fs::path root = fs::current_path();
    return buildTree(root).dump();
}

/**
 * Handler for GET /api/workspace/read?path=...
 */
std::string handleReadFile(const std::string& filePath) {
    // Basic Path Traversal Protection
    if (filePath.find("..") != std::string::npos) {
        return "ERROR: Access denied (path traversal detected).";
    }

    fs::path p(filePath);
    if (!fs::exists(p) || fs::is_directory(p)) {
        return "ERROR: File not found.";
    }

    std::ifstream file(p, std::ios::in | std::ios::binary);
    if (!file.is_open()) {
        return "ERROR: Could not open file.";
    }

    std::string content((std::istreambuf_iterator<char>(file)),
                       std::istreambuf_iterator<char>());
    return content;
}

} // namespace CaramelPepper::API
