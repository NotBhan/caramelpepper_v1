# Octamind AI 🧠 UI & Features Documentation

Welcome to the technical overview of the Octamind AI workspace. This document outlines the interface architecture and core engines that drive our privacy-first refactoring experience.

---

## 1. Workspace Architecture 🏗️

Octamind AI features a **Dynamic Resizable Layout** built on `react-resizable-panels`. This IDE-grade workspace is designed for high-density information display without cognitive overload.

*   **Left Sidebar (The Navigator):** Dedicated to project exploration and high-level navigation.
*   **Main Stage (The Workbench):** A split-view area featuring the primary Monaco Editor and the contextual Diff Viewer.
*   **Bottom Panel (The Console):** A collapsible area for real-time refactoring strategies and task lists.
*   **Right Panel (The Analyst):** Detailed complexity reports and style detection diagnostics.

---

## 2. UI Panels Deep-Dive 🔍

### File Tree 📂
A recursive directory viewer powered by the C++ Filesystem API.
*   **Recursive Viewing:** Supports deep project structures with high performance.
*   **Exclusion Logic:** Automatically filters out `.git`, `node_modules`, and heavy binary artifacts (like `.gguf` models).
*   **Active Highlighting:** Clear visual feedback with the branding highlight for the currently open file.

### Main Editor ⌨️
The heart of the app, powered by Monaco (the engine behind VS Code).
*   **Syntax Highlighting:** Full support for TypeScript, C++, Python, and more.
*   **LSP Features:** Integrated language service support for real-time code intelligence.

### Diff Viewer ⚖️
A side-by-side comparison tool that activates only during the refactoring workflow.
*   **Side-by-Side Comparison:** Highlights every addition and deletion between the original and proposed code.
*   **Accept/Reject Bar:** A streamlined action bar to either `Commit Changes` or `Discard` them instantly.

### Health Gauge / Metrics 🟢🟡🔴
Visual representation of code health based on mathematical analysis.
*   **Cyclomatic Complexity:** Measures the number of independent paths through your source code.
*   **Maintainability Index:** A calculated score (0-100%) of how sustainable the code is.
*   **Risk Indicators:** Color-coded badges and progress bars.

---

## 3. Core Features & Workflows ⚙️

### The Complexity Meter 📏
Behind the scenes, our engine performs a mathematical analysis of the code structure. It scores your code before and after the refactoring process, allowing you to see the exact reduction in "Cognitive Load" before you accept a change.

### The Style Detective 🕵️‍♂️
Before generating a single line of code, Octamind AI's AI pre-processor scans your existing files to detect:
*   **Naming Conventions:** (camelCase, snake_case, PascalCase).
*   **Indentation Prefs:** (2 spaces, 4 spaces, or Tabs).
*   **Brace Styles:** (K&R vs Allman).
This ensures that every AI-generated suggestion feels like you wrote it yourself.

### Hybrid Inference Engine 🧠
Octamind AI is "Privacy by Default, Cloud Optional". Through the **Settings Vault**, you can swap between:
*   **Local:** 100% private, offline inference using `llama.cpp` running directly on your CPU/GPU.
*   **Cloud:** High-performance, context-aware processing via Anthropic (Claude), OpenAI (GPT-4), or Google (Gemini).

---

Ready to optimize your code? Happy Refactoring! 🧠
