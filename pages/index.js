import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingByDate } from '../utils/sort';

import Header from '@/components/chrome/Header';
import SectionHero from '@/components/sections/hero/HeroHome';
import HomeFeaturedProjects from '@/components/sections/projects/HomeFeaturedProjects';
import Footer from '@/components/chrome/Footer';

export default function Home({ posts }) {
  return (
    <>
      <Header />
      <SectionHero />
      <HomeFeaturedProjects posts={posts} />
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
