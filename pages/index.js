import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingByDate } from '../utils/sort';

import Header from '@/components/chrome/Header';
import SectionHero from '@/components/sections/HeroHome';
import SectionFeaturedProjects from '@/components/sections/FeaturedProjects';
import SectionAbout from '@/components/sections/About';
import Footer from '@/components/chrome/Footer';

export default function Home({ posts }) {
  const slicedPosts = posts.slice(0, 3);

  return (
    <>
      <Header />
      <SectionHero />
      <SectionFeaturedProjects posts={slicedPosts} />
      <SectionAbout />
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
  })

  return {
    props: {
      posts: posts.sort(sortDescendingByDate),
    },
  };
};
