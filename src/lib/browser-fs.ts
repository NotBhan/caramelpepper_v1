
import { FileItem } from "@/store/use-app-store";

/**
 * Recursively reads a FileSystemDirectoryHandle and converts it into a FileItem tree.
 * Filters out heavy directories and attaches handles to each node for direct browser access.
 */
export async function readDirectoryRecursive(
  dirHandle: any, // FileSystemDirectoryHandle
  parentPath: string = ""
): Promise<FileItem[]> {
  const IGNORE_LIST = ['.git', 'node_modules', '.next', 'build', '.gguf', 'out', '.cache'];
  const items: FileItem[] = [];

  try {
    for await (const entry of dirHandle.values()) {
      if (IGNORE_LIST.includes(entry.name)) continue;

      const fullPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      const item: FileItem = {
        name: entry.name,
        path: fullPath,
        is_dir: entry.kind === 'directory',
        handle: entry,
      };

      if (entry.kind === 'directory') {
        item.children = await readDirectoryRecursive(entry, fullPath);
      }

      items.push(item);
    }
  } catch (err) {
    console.error(`Error reading directory ${dirHandle.name}:`, err);
  }

  return items.sort((a, b) => {
    if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
