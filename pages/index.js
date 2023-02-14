import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingyDate } from '../utils/sort';

import Header from '@/components/Header';
import SectionHero from '@/components/SectionHero';
import SectionCards from '@/components/SectionCards';
import SectionAbout from '@/components/SectionAbout';
import Footer from '@/components/Footer';

export default function Home({ posts }) {
  return (
    <>
      <Header />
      <SectionHero />
      <SectionCards posts={posts} />
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
      posts: posts.sort(sortDescendingyDate),
    },
  };
};
