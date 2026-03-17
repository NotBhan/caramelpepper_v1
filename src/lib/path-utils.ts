import path from 'path';

/**
 * Normalizes an absolute path to be OS-agnostic.
 * Handles backslash conversion, Windows drive letters, and segment resolution.
 * 
 * @param rawPath The raw path string from the user or filesystem.
 * @returns A normalized path string using forward slashes.
 */
export function normalizeAbsolutePath(rawPath: string): string {
  if (!rawPath) return '';

  // 1. Convert all backslashes to forward slashes
  let normalized = rawPath.replace(/\\/g, '/');

  // 2. Handle Windows drive letters (e.g., C:/...)
  // We want to ensure we don't accidentally prefix these with / if they are already absolute
  const windowDriveRegex = /^[a-zA-Z]:\//;
  
  // 3. Resolve . and .. segments using POSIX logic for consistency
  // path.posix.normalize is safer for cross-platform web-to-server paths
  normalized = path.posix.normalize(normalized);

  // 4. Ensure Windows drive letters aren't mangled by posix normalization 
  // (which might turn C:/ into C:)
  if (windowDriveRegex.test(rawPath.replace(/\\/g, '/')) && !normalized.includes(':/')) {
    normalized = normalized.replace(/^([a-zA-Z]):/, '$1:/');
  }

  return normalized;
}
