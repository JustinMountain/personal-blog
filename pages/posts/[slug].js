import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter';
import Head from 'next/head';

import Header from '@/components/Header';
import markdownToHtml from '@/utils/markdownToHtml';
import Footer from '@/components/Footer';

export default function PostPage({ slug, frontmatter: { title, date }, htmlContent }) {
  return (
    <>
    <Head>
      <title>{`${title} - Justin Mountain`}</title>
      <meta property="og:title" content={title} key="title" />
    </Head>
      <Header mainText="Justin Mountain" />
      <div className="mx-auto my-8 max-w-screen-xl px-6 ">
        <article className="prose mx-auto">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>
      </div>
      <Footer mainText="Copyright 2023 Justin Mountain" />
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

  return {
    props: {
      slug, frontmatter, htmlContent
    }
  }
}
