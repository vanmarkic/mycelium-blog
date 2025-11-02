/**
 * Privacy Filter
 *
 * Determines privacy level for repositories based on git config and path patterns
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import type { PrivacyLevel } from '../src/types/content.js';

export interface PrivacyConfig {
  patterns: {
    internal: string[]; // Patterns that indicate internal/client work
    public: string[]; // Patterns that indicate public work
  };
  remotes: {
    internal: string[]; // Git remote patterns for internal work
  };
}

const DEFAULT_CONFIG: PrivacyConfig = {
  patterns: {
    internal: ['neo-*', 'client-*'],
    public: ['*'],
  },
  remotes: {
    internal: ['dragancloudbizz'],
  },
};

/**
 * Determines the privacy level of a repository
 */
export async function determinePrivacy(
  repoPath: string,
  config: PrivacyConfig = DEFAULT_CONFIG
): Promise<PrivacyLevel> {
  try {
    // Get git remote URL
    const remote = execSync('git config --get remote.origin.url', {
      cwd: repoPath,
      encoding: 'utf-8',
    }).trim();

    // Get repo name from path
    const repoName = path.basename(repoPath);

    // Check if remote contains internal organization
    const isInternalRemote = config.remotes.internal.some((pattern) =>
      remote.includes(pattern)
    );

    // Check if repo name matches internal patterns
    const isInternalPattern = config.patterns.internal.some((pattern) => {
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
      return regex.test(repoName);
    });

    // If both conditions are met, it's internal (client work)
    if (isInternalRemote && isInternalPattern) {
      return 'internal';
    }

    return 'public';
  } catch (error) {
    // If git config fails, assume public
    console.warn(`Could not determine privacy for ${repoPath}:`, error);
    return 'public';
  }
}

/**
 * Sanitizes content for internal posts by removing sensitive information
 */
export function sanitizeInternalContent(content: string): string {
  let sanitized = content;

  // Remove common sensitive patterns
  const sensitivePatterns = [
    // Company/client names
    /dragancloudbizz/gi,
    /cloudbizz/gi,
    // Email addresses
    /[\w.-]+@[\w.-]+\.\w+/g,
    // URLs with domain names (keep generic examples)
    /https?:\/\/(?!example\.com|localhost)[^\s)]+/gi,
    // Financial information
    /\$[\d,]+(\.\d{2})?/g,
    /€[\d,]+(\.\d{2})?/g,
    // IP addresses
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    // API keys and tokens (common patterns)
    /[a-zA-Z0-9]{32,}/g,
  ];

  for (const pattern of sensitivePatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  return sanitized;
}

/**
 * Validates that a title is generic enough for internal posts
 */
export function validateInternalTitle(title: string): {
  valid: boolean;
  suggestion?: string;
} {
  const problematicPatterns = [
    { pattern: /client|customer/i, suggestion: 'Use "Project" or describe the technology' },
    { pattern: /neo-\w+/i, suggestion: 'Use generic project terminology' },
    { pattern: /dragancloudbizz/i, suggestion: 'Remove company references' },
  ];

  for (const { pattern, suggestion } of problematicPatterns) {
    if (pattern.test(title)) {
      return { valid: false, suggestion };
    }
  }

  return { valid: true };
}

/**
 * Suggests a generic title based on detected patterns and technologies
 */
export function suggestGenericTitle(
  originalTitle: string,
  detectedPatterns: string[],
  techStack: string[]
): string {
  // Remove client/business references
  let generic = originalTitle
    .replace(/neo-\w+/gi, '')
    .replace(/client|customer/gi, 'Project')
    .replace(/dragancloudbizz/gi, '')
    .trim();

  // If title is too vague after sanitization, build from patterns
  if (generic.length < 10 && (detectedPatterns.length > 0 || techStack.length > 0)) {
    const primaryTech = techStack[0] || 'System';
    const primaryPattern = detectedPatterns[0] || 'Implementation';
    generic = `${primaryPattern} with ${primaryTech}`;
  }

  return generic;
}
