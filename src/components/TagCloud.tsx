/**
 * Tag Cloud Component
 *
 * Interactive tag cloud for navigation
 */

import { useState } from 'react';

interface TagCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

export default function TagCloud({ tags, onTagClick }: TagCloudProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
    onTagClick?.(tag);
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore by Topic</h2>
      <div className="flex flex-wrap gap-2">
        {tags.sort().map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === tag
                ? 'bg-mycelium-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-mycelium-600 dark:text-mycelium-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
