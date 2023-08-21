import React from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter';

import Header from '@/components/chrome/Header';
import markdownToHtml from '@/utils/markdownToHtml';
import Footer from '@/components/chrome/Footer';
import HeroOneProject from '@/components/sections/hero/HeroOneProject';
import CustomHeading from '@/components/utility/CustomHeading';
import ProjectCard from '@/components/sections/projects/ProjectCard';
import SocialLinks from '@/components/utility/SocialLinks';

export default function PostPage({ frontmatter, slug, htmlContent }) {
  return (
    <>
      <Header />

      <HeroOneProject frontmatter={frontmatter} slug={slug} />

      <div className="bg-secondary">

        <div className="mx-auto max-w-screen-xl pt-16
                        md:p-24
                        lg:grid lg:grid-cols-3 lg:gap-2">

          <div className="lg:col-start-1 lg:col-end-3">
            <article className="prose mx-auto px-4 lg:px-0
                                prose-invert
                                prose-headings:font-normal
                                prose-h3:text-2xl prose-h3:mt-4 first:prose-h3:mt-0 first:prose-h3:pt-0
                                prose-h4:text-xl prose-h4:mb-4
                                prose-ul:list-none first:prose-ul:pb-4
                                prose-li:text-lg
                                [&>a]:prose-li:no-underline
                                prose-a:text-light
                                hover:prose-a:text-accent
                                prose-blockquote:border-accent prose-blockquote:bg-primary prose-blockquote:px-2 prose-blockquote:rounded-r-lg
                                [&>p]:prose-blockquote:px-2 [&>p]:prose-blockquote:py-4 
                                prose-p:pt-0
                                prose-img:mb-0
                                ">

              <CustomHeading head="" subhead={frontmatter.tags} />

              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              <div className="pt-8 pb-24">
                <SocialLinks fillColor="white" discuss={true} />
              </div>

            </article>
          </div>

          <div className="lg:col-start-3 lg:col-end-4">
            <div className="hidden lg:inline">
              <ProjectCard frontmatter={frontmatter} slug={slug} />

            </div>
          </div>
        </div>
      </div>
      <Footer />
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
