import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingByDate } from '../utils/sort';
import Head
 from 'next/head';
import Header from '@/components/chrome/Header';
import HeroProjects from '@/components/sections/hero/HeroProjects';
import ProjectsAll from '@/components/sections/projects/ProjectsAll';
import Roadmap from '@/components/sections/Roadmap';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/chrome/Footer';

export default function Projects({ index, posts }) {
  return (
    <>
      <Head>
        <title>{`Projects - Justin Mountain`}</title>
      </Head>

      <Header />
      <HeroProjects posts={posts} />
      <ProjectsAll posts={posts} />
      <Roadmap />
      <Contact />
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8')
    const { data: frontmatter } = matter(markdownWithMeta)

    return {
      filename, slug, frontmatter
    }
  }).filter(post => post.frontmatter.published !== "no");

  return {
    props: {
      posts: posts.sort(sortDescendingByDate),
    },
  };
};
