import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter';

export default function PostPage({ slug, frontmatter: { title, date }, content }) {
  return <div>{title}{date}{slug}{content}</div>
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

  const {data:frontmatter, content} = matter(markdownWithMeta)

  return {
    props: {
      slug, frontmatter, content
    }
  }
}