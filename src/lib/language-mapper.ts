/**
 * @fileOverview Utility to map file extensions to Monaco language identifiers.
 */

export function getLanguageFromPath(filePath: string | null): string {
  if (!filePath) return 'plaintext';
  
  const ext = filePath.split('.').pop()?.toLowerCase();
  
  const map: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'cpp': 'cpp',
    'c': 'cpp',
    'cc': 'cpp',
    'h': 'cpp',
    'hpp': 'cpp',
    'py': 'python',
    'json': 'json',
    'md': 'markdown',
    'html': 'html',
    'css': 'css',
    'rs': 'rust',
    'go': 'go',
    'java': 'java',
    'sh': 'shell',
    'bash': 'shell',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
    'php': 'php',
    'rb': 'ruby',
    'swift': 'swift',
    'kt': 'kotlin',
  };

  return map[ext || ''] || 'plaintext';
}
