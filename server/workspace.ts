import path from 'path';
import fs from 'fs';

/**
 * Gets or creates the workspace root folder for a specific user
 */
export function getUserWorkspace(userId: string): string {
  const wsDir = path.resolve(process.cwd(), 'workspaces', `user_${userId}`);
  if (!fs.existsSync(wsDir)) {
    fs.mkdirSync(wsDir, { recursive: true });
    
    // Seed with a couple of helper files so they have a starter workspace
    const readmePath = path.join(wsDir, 'README.md');
    fs.writeFileSync(
      readmePath, 
      `# WyrmSentry IDE Workspace\nWelcome to your private sandboxed secure environment!\n\nThis workspace is scoped strictly to your account. Feel free to create and edit files here.\n`,
      'utf-8'
    );
    
    const indexJsPath = path.join(wsDir, 'index.js');
    fs.writeFileSync(
      indexJsPath,
      `// Simple JavaScript demonstration\nfunction greet(name) {\n  return \`Greetings, \${name}! Welcome to WyrmSentry.\`;\n}\n\nconsole.log(greet('Developer'));\n`,
      'utf-8'
    );
  }
  return wsDir;
}

/**
 * Resolves a file path relative to a user's workspace and ensures it doesn't escape boundaries
 */
export function resolveAndValidatePath(userId: string, relativeFilePath: string): string {
  if (!relativeFilePath) {
    throw new Error('Path is required');
  }
  
  const workspaceDir = getUserWorkspace(userId);
  const resolvedPath = path.resolve(workspaceDir, relativeFilePath);
  
  // Boundary check using path.relative to verify resolvedPath is strictly inside workspaceDir
  const relative = path.relative(workspaceDir, resolvedPath);
  
  const isOutside = relative.startsWith('..') || path.isAbsolute(relative);
  if (isOutside) {
    throw new Error('Access denied: Path is outside the authorized workspace boundary.');
  }
  
  return resolvedPath;
}

/**
 * Helper to recursively list files in user workspace
 */
export function getUserFilesRecursively(userId: string): string[] {
  const workspaceDir = getUserWorkspace(userId);
  return getFilesRecursively(workspaceDir, workspaceDir);
}

function getFilesRecursively(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    // Filter heavy/internal folders
    if (
      file === 'node_modules' ||
      file === 'dist' ||
      file === '.git' ||
      file === 'package-lock.json' ||
      file === 'bun.lock' ||
      file === '.env' ||
      file === '.env.example' ||
      file === 'tmp'
    ) {
      continue;
    }

    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, baseDir));
    } else {
      results.push(relativePath);
    }
  }
  return results;
}
