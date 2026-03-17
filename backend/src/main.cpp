
#include "crow.h"
#include "api/fs_handlers.cpp"
#include "api/handlers.cpp"

/**
 * @file main.cpp
 * @brief Entry point for the CaramelPepper C++ backend server.
 */

int main() {
    crow::SimpleApp app;

    // AI Refactoring Endpoints
    CROW_ROUTE(app, "/api/refactor").methods(crow::HTTPMethod::POST)([](const crow::request& req) {
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400);
        
        CaramelPepper::API::RefactorRequest request;
        request.code = x["code"].s();
        request.engineType = x["engineType"].s();
        
        return crow::response(CaramelPepper::API::handleRefactorRequest(request));
    });

    // Vault/Settings Endpoints
    CROW_ROUTE(app, "/api/settings/keys").methods(crow::HTTPMethod::POST)([](const crow::request& req) {
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400);
        
        CaramelPepper::API::KeyStorageRequest request;
        request.provider = x["provider"].s();
        request.key = x["key"].s();
        
        return CaramelPepper::API::handleStoreKey(request) ? crow::response(200) : crow::response(400);
    });

    CROW_ROUTE(app, "/api/settings/keys/status")([]() {
        return crow::json::wvalue(CaramelPepper::API::handleGetKeyStatus());
    });

    // Workspace/Filesystem Endpoints
    CROW_ROUTE(app, "/api/workspace/tree")([]() {
        return crow::response(CaramelPepper::API::handleGetWorkspaceTree());
    });

    CROW_ROUTE(app, "/api/workspace/read")([](const crow::request& req) {
        auto path = req.url_params.get("path");
        if (!path) return crow::response(400, "Missing path parameter");
        return crow::response(CaramelPepper::API::handleReadFile(path));
    });

    app.port(18080).multithreaded().run();
}
