/**
 * Content Validation Utilities
 *
 * Functions to validate frontmatter schema and content integrity
 */

import type { PostFrontmatter, ContentStatus, PrivacyLevel } from '../types/content';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates post frontmatter against the schema
 */
export function validateFrontmatter(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'frontmatter', message: 'Frontmatter must be an object' }],
    };
  }

  const fm = data as Partial<PostFrontmatter>;

  // Required: title
  if (!fm.title || typeof fm.title !== 'string' || fm.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  // Optional: date (but validate if present)
  if (fm.date) {
    if (typeof fm.date !== 'string') {
      errors.push({ field: 'date', message: 'Date must be a string' });
    } else if (!isValidDate(fm.date)) {
      errors.push({ field: 'date', message: 'Date must be a valid ISO date (YYYY-MM-DD)' });
    }
  }

  // Optional: status (but validate if present)
  if (fm.status && !isValidStatus(fm.status)) {
    errors.push({
      field: 'status',
      message: 'Status must be "draft" or "published"',
    });
  }

  // Optional: privacy (but validate if present)
  if (fm.privacy && !isValidPrivacy(fm.privacy)) {
    errors.push({
      field: 'privacy',
      message: 'Privacy must be "public" or "internal"',
    });
  }

  // Optional: tags (but validate if present)
  if (fm.tags !== undefined) {
    if (!Array.isArray(fm.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (!fm.tags.every((tag) => typeof tag === 'string')) {
      errors.push({ field: 'tags', message: 'All tags must be strings' });
    }
  }

  // Optional: repos (but validate if present)
  if (fm.repos !== undefined) {
    if (!Array.isArray(fm.repos)) {
      errors.push({ field: 'repos', message: 'Repos must be an array' });
    } else if (!fm.repos.every((repo) => typeof repo === 'string')) {
      errors.push({ field: 'repos', message: 'All repos must be strings' });
    }
  }

  // Optional but must be array: skills
  if (fm.skills !== undefined) {
    if (!Array.isArray(fm.skills)) {
      errors.push({ field: 'skills', message: 'Skills must be an array' });
    } else if (!fm.skills.every((skill) => typeof skill === 'string')) {
      errors.push({ field: 'skills', message: 'All skills must be strings' });
    }
  }

  // Optional but must be array: patterns
  if (fm.patterns !== undefined) {
    if (!Array.isArray(fm.patterns)) {
      errors.push({ field: 'patterns', message: 'Patterns must be an array' });
    } else if (!fm.patterns.every((pattern) => typeof pattern === 'string')) {
      errors.push({ field: 'patterns', message: 'All patterns must be strings' });
    }
  }

  // Optional but must be array: relatedTo
  if (fm.relatedTo !== undefined) {
    if (!Array.isArray(fm.relatedTo)) {
      errors.push({ field: 'relatedTo', message: 'RelatedTo must be an array' });
    } else if (!fm.relatedTo.every((id) => typeof id === 'string')) {
      errors.push({ field: 'relatedTo', message: 'All relatedTo IDs must be strings' });
    }
  }

  // Optional: description
  if (fm.description !== undefined && typeof fm.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates privacy compliance for internal posts
 */
export function validatePrivacyCompliance(
  frontmatter: PostFrontmatter,
  content: string
): ValidationResult {
  const errors: ValidationError[] = [];

  if (frontmatter.privacy === 'internal') {
    // Check for common privacy violations
    const violations = [
      { pattern: /dragancloudbizz/gi, name: 'company name' },
      { pattern: /cloudbizz/gi, name: 'company name' },
      { pattern: /client\s+\w+/gi, name: 'client reference' },
      { pattern: /\$[\d,]+/g, name: 'financial information' },
      { pattern: /https?:\/\/.*\.com/gi, name: 'external URL' },
    ];

    for (const violation of violations) {
      if (violation.pattern.test(content) || violation.pattern.test(frontmatter.title)) {
        errors.push({
          field: 'privacy',
          message: `Internal post contains ${violation.name}. Use generic terminology.`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Type guard for ContentStatus
 */
function isValidStatus(value: unknown): value is ContentStatus {
  return value === 'draft' || value === 'published';
}

/**
 * Type guard for PrivacyLevel
 */
function isValidPrivacy(value: unknown): value is PrivacyLevel {
  return value === 'public' || value === 'internal';
}

/**
 * Validates ISO date format (YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Generates default frontmatter for a new post
 */
export function generateDefaultFrontmatter(): Partial<PostFrontmatter> {
  const today = new Date().toISOString().split('T')[0];

  return {
    title: 'Untitled Post',
    date: today,
    status: 'draft',
    privacy: 'public',
    tags: [],
    repos: [],
    skills: [],
    patterns: [],
    relatedTo: [],
  };
}
