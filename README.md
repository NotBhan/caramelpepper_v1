# Octamind AI 🧠

A privacy-first, AI-powered local IDE and code refactoring engine. Octamind AI bridges the gap between powerful cloud-based LLMs and secure, offline local models, giving you a lightning-fast, highly contextual coding assistant that lives directly on your machine or in the cloud.

## ✨ Features

* **Multi-Engine AI Support:** Seamlessly toggle between Cloud providers (OpenAI, Anthropic, Gemini) and Local engines (Ollama, llama.cpp) for zero-latency, privacy-compliant refactoring.
* **Native & Browser File System Access:** Open single files or entire workspaces. Octamind AI reads and writes directly to your hard drive using a Node.js backend when running locally, or utilizes the Browser FS API in hosted mode.
* **Pro-Grade Editor:** Powered by Monaco Editor with automatic syntax detection, responsive layout wrapping, and side-by-side diff viewers for granular code reviews.
* **Firebase Multi-Tenant Authentication:** Built-in Firebase Auth supporting GitHub OAuth. Your session state is seamlessly managed via our unified global store with automatic session persistence.
* **Protected & Isolated Views:** The Local Secret Vault and Optimization History are gated behind an authentication wall. Firestore multi-tenancy ensures that all API secrets and refactoring histories are strictly isolated by your unique User ID.
* **Dynamic IDE Shell:** A responsive, multi-view architecture featuring an Activity Bar with a dedicated user profile section for easy sign-in/sign-out and rapid navigation.

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router, Node.js API Routes)
* **Frontend:** React, Tailwind CSS, lucide-react
* **State Management:** Custom Store (Context + Hooks)
* **Editor:** @monaco-editor/react
* **Authentication & Database:** Firebase Authentication & Cloud Firestore

## 🚀 Getting Started (Local & Hosted Development)

### Prerequisites

* Node.js (v18.17 or newer)
* Git
* A Firebase Project (for Authentication and Firestore)
* (Optional but recommended) Ollama or a llama.cpp server for local AI execution.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/OctamindAI.git
   cd OctamindAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase configuration credentials:
   ```env
   # Firebase Client SDK Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Optional: Cloud API Keys (can also be set securely in the app's UI Vault)
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app:
   Navigate to `http://localhost:3000` in your browser.

## 🧠 Connecting Local AI (Ollama)

To keep your code 100% private, you can run models locally using Ollama:

1. Download and install [Ollama](https://ollama.com/).
2. Pull a coding model:
   ```bash
   ollama run qwen2.5-coder:7b
   ```
3. In the Octamind AI UI, navigate to the **Settings**.
4. Select the **Local** tab and set the provider to **Ollama**.
5. Ensure the URL is set to `http://127.0.0.1:11434` and enter your model name.

## 📂 Workspace Modes

Octamind AI supports two distinct ways to interact with your code:

* **Workspace Mode:** Enter an absolute path (e.g., `C:/Projects/MyApp`) to load a full file tree in the sidebar (Local Mode), or use the Browser FS API to select a local folder (Hosted Mode).
* **Single File Mode:** Click "Skip Workspace" on boot to use the app as a lightweight, single-file refactoring scratchpad without needing a root directory.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
