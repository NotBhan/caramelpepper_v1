import { type FileItem } from "./use-app-store";

/**
 * @fileOverview Realistic mock directory structure for a C++ project.
 * Used for UI/UX prototyping of the File Explorer.
 */

export const MOCK_FILE_TREE: FileItem[] = [
  {
    name: "src",
    path: "src",
    is_dir: true,
    children: [
      { name: "main.cpp", path: "src/main.cpp", is_dir: false },
      {
        name: "core",
        path: "src/core",
        is_dir: true,
        children: [
          { name: "analyzer.cpp", path: "src/core/analyzer.cpp", is_dir: false },
          { name: "optimizer.cpp", path: "src/core/optimizer.cpp", is_dir: false },
        ],
      },
    ],
  },
  {
    name: "include",
    path: "include",
    is_dir: true,
    children: [
      {
        name: "core",
        path: "include/core",
        is_dir: true,
        children: [
          { name: "analyzer.hpp", path: "include/core/analyzer.hpp", is_dir: false },
        ],
      },
    ],
  },
  { name: "CMakeLists.txt", path: "CMakeLists.txt", is_dir: false },
  { name: "README.md", path: "README.md", is_dir: false },
];
