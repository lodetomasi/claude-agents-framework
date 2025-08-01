import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

/**
 * Utility functions for the framework
 */

/**
 * Get the default agents directory
 */
export function getDefaultAgentsPath(): string {
  return path.join(os.homedir(), '.claude', 'agents');
}

/**
 * Ensure a directory exists
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

/**
 * Read JSON file
 */
export async function readJSON(filePath: string): Promise<any> {
  return fs.readJSON(filePath);
}

/**
 * Write JSON file
 */
export async function writeJSON(filePath: string, data: any): Promise<void> {
  await fs.writeJSON(filePath, data, { spaces: 2 });
}

/**
 * Sanitize agent name
 */
export function sanitizeAgentName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Get file stats
 */
export async function getFileStats(filePath: string): Promise<{
  size: number;
  created: Date;
  modified: Date;
}> {
  const stats = await fs.stat(filePath);
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime
  };
}

/**
 * Copy file with backup
 */
export async function copyWithBackup(source: string, dest: string): Promise<void> {
  if (await fileExists(dest)) {
    const backupPath = `${dest}.backup.${Date.now()}`;
    await fs.copy(dest, backupPath);
  }
  await fs.copy(source, dest);
}

/**
 * Find project root (containing package.json)
 */
export async function findProjectRoot(startPath: string = process.cwd()): Promise<string | null> {
  let currentPath = startPath;
  
  while (currentPath !== path.parse(currentPath).root) {
    if (await fileExists(path.join(currentPath, 'package.json'))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  
  return null;
}

/**
 * Parse frontmatter from markdown
 */
export function parseFrontmatter(content: string): {
  metadata: any;
  content: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    return { metadata: {}, content };
  }

  try {
    const yaml = require('yaml');
    const metadata = yaml.parse(match[1]!);
    const body = match[2]!.trim();
    return { metadata, content: body };
  } catch (error) {
    throw new Error('Invalid frontmatter format');
  }
}