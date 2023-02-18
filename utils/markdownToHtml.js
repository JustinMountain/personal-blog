import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkToc from 'remark-toc';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

// Takes a markdown file and converts it to HTML
  // Builds a table of contents with links based on the headers in the markdown
export default async function markdownToHtml(markdown) {
  const result = await unified()
  .use(remarkParse)
  .use(remarkToc)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeSlug)
  .use(rehypeStringify, {allowDangerousHtml: true})
  .process(markdown);

  return result.toString();
};
