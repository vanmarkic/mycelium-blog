import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../utils/markdown';

export async function GET(context: APIContext) {
  const contentDir = new URL('../../content', import.meta.url).pathname;
  const posts = await getPublishedPosts(contentDir);

  return rss({
    title: 'Mycelium Blog',
    description: 'A digital garden exploring technical patterns, Claude Code workflows, and interconnected knowledge',
    site: context.site?.toString() || 'https://vanmarkic.github.io',
    items: posts.map((post) => ({
      title: post.frontmatter.title,
      pubDate: new Date(post.frontmatter.date),
      description: post.frontmatter.description || `${post.frontmatter.title} — exploring ${post.frontmatter.tags.join(', ')}`,
      link: `/mycelium-blog/posts/${post.slug}/`,
      categories: post.frontmatter.tags,
    })),
    customData: `<language>fr</language>`,
  });
}
