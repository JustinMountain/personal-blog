import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter';

import Header from '@/components/Header';
import markdownToHtml from '@/utils/markdownToHtml';
import { globalStyles } from '@/utils/globalStyles';

export default function PostPage({ slug, frontmatter: { title, date }, htmlContent }) {
  return (
    <>
      <Header mainText="Justin Mountain" />
      <div className="mx-auto my-8 border max-w-screen-2xl px-6 ">
        <article className="prose lg:prose-xl">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>
      </div>
      <Header mainText="Copyright 2023 Justin Mountain" />
    </>
  )
}

export async function getStaticPaths() {

  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  return {
    paths: paths,
    fallback: false // Displays 404 on non-existent pages
  }
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8')

  const { data: frontmatter, content } = matter(markdownWithMeta)
  const htmlContent = await markdownToHtml(content);
  console.log(htmlContent)
  return {
    props: {
      slug, frontmatter, htmlContent
    }
  }
}

// Add title dynamic from slug
// Add tailwind for prose:
  // h2
  // h3
  // h4
  // p
  // pre / code
  // ul
  // li
  // ol
  // link
  // blockquote?