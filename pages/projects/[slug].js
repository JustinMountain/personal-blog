import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownToHtml from '@/utils/markdownToHtml';
import { sortDescendingByDate } from '../../utils/sort';
import Head from 'next/head';
import Header from '@/components/chrome/Header';
import HeroOneProject from '@/components/sections/hero/HeroOneProject';
import CustomHeading from '@/components/utility/CustomHeading';
import SocialLinks from '@/components/utility/SocialLinks';
import SimilarPosts from '@/components/sections/SimilarPosts';
import Footer from '@/components/chrome/Footer';

export default function PostPage({ frontmatter, slug, htmlContent, similarPosts }) {
  return (
    <>
      <Head>
        <title>{`${frontmatter.title} - Justin Mountain`}</title>
      </Head>

      <Header />

      <HeroOneProject frontmatter={frontmatter} slug={slug} />

      <div className="bg-secondary">

        <div className="mx-auto max-w-lg py-16 px-4 
                        md:max-w-7xl md:px-8
                        lg:grid lg:grid-cols-3 lg:gap-8 lg:py-24
                        2xl:px-0 2xl:gap-16">

          <div className="lg:col-start-1 lg:col-end-3">
            <article className="max-w-5xl prose mx-auto
                                md:max-w-xl
                                lg:max-w-full
                                prose-invert
                                prose-headings:font-normal
                                prose-h3:text-2xl prose-h3:mt-4 first:prose-h3:mt-0 first:prose-h3:pt-0
                                prose-h4:text-xl prose-h4:mb-4
                                prose-h5:text-xl prose-h5:italic prose-h5:text-light
                                prose-ul:list-none first:prose-ul:pb-4
                                prose-li:text-lg
                                prose-p:text-lg
                                [&>a]:prose-li:no-underline
                                prose-a:text-light
                                hover:prose-a:text-accent
                                prose-blockquote:border-accent prose-blockquote:border-r prose-blockquote:bg-primary prose-blockquote:px-2 prose-blockquote:rounded-r-lg
                                [&>p]:prose-blockquote:px-2 [&>p]:prose-blockquote:py-4 
                                prose-p:pt-0
                                prose-img:mb-0
                                xl:prose-h3:text-3xl xl:prose-h4:text-2xl xl:prose-h5:text-xl">

              <CustomHeading head="" subhead={frontmatter.tags} />

              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              <div className="pt-8">
                <p className="text-lg py-8">
                  Discuss with me:
                </p>
                <SocialLinks bgColor="secondary" discuss={true} />
              </div>

            </article>
          </div>

          <div className="lg:col-start-3 lg:col-end-4">
            <div className="hidden lg:inline">
              <SimilarPosts similarPosts={similarPosts} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getStaticPaths() {

  const files = fs.readdirSync(path.join('projects'))

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
  // Get data for an individual post's page
  const markdownWithMeta = fs.readFileSync(path.join('projects', slug + '.md'), 'utf-8')

  const { data: frontmatter, content } = matter(markdownWithMeta)
  const htmlContent = await markdownToHtml(content);

  // Get all post data for similar post component
  const files = fs.readdirSync(path.join('projects'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(path.join('projects', filename), 'utf-8')
    const { data: frontmatter } = matter(markdownWithMeta)

    return {
      filename, slug, frontmatter
    }
  }).filter(post => post.frontmatter.published !== "no");

  // Find all similar posts, sort by tag similarity
  const theseTags = frontmatter.tags.split(", ");
  let relatedPosts = posts.filter(post => {
    const postTags = post.frontmatter.tags.split(', ');
    const matchingTags = postTags.filter(tag => theseTags.includes(tag));
    post.matchingTagCount = matchingTags.length
    return matchingTags.length > 0; 
  }).filter(post => post.frontmatter.tags !== frontmatter.tags);

  if (relatedPosts.length === 0) {
    relatedPosts = posts.filter(post => post.frontmatter.featured !== "no");
  } else {
    relatedPosts.sort((a, b) => b.matchingTagCount - a.matchingTagCount);
  }

  return {
    props: {
      similarPosts: relatedPosts.sort(sortDescendingByDate),
      slug, frontmatter, htmlContent
    }
  }
}
