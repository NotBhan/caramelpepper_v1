#include <filesystem>
#include <fstream>
#include <string>
#include <vector>
#include <set>
#include <algorithm>
#include "nlohmann/json.hpp"

namespace CaramelPepper::API {

namespace fs = std::filesystem;
using json = nlohmann::json;

const std::set<std::string> IGNORE_LIST = {".git", "node_modules", "build", ".gguf", ".next", "out"};

json buildTree(const fs::path& path) {
    json result = json::array();
    
    try {
        if (!fs::exists(path)) return result;

        for (const auto& entry : fs::directory_iterator(path)) {
            std::string name = entry.path().filename().string();
            
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
    }

    std::sort(result.begin(), result.end(), [](const json& a, const json& b) {
        if (a["is_dir"] != b["is_dir"]) return a["is_dir"].get<bool>();
        return a["name"].get<std::string>() < b["name"].get<std::string>();
    });

    return result;
}

std::string handleGetWorkspaceTree(const std::string& rootPath = "") {
    fs::path root = rootPath.empty() ? fs::current_path() : fs::path(rootPath);
    return buildTree(root).dump();
}

std::string handleReadFile(const std::string& filePath) {
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

bool handleSaveFile(const std::string& filePath, const std::string& content) {
    if (filePath.empty()) return false;
    
    if (filePath.find("..") != std::string::npos) return false;

    try {
        fs::path p(filePath);
        if (p.has_parent_path()) {
            fs::create_directories(p.parent_path());
        }

        std::ofstream file(p, std::ios::out | std::ios::binary | std::ios::trunc);
        if (!file.is_open()) return false;

        file << content;
        file.close();
        return true;
    } catch (const std::exception& e) {
        return false;
    }
}

} // namespace CaramelPepper::API