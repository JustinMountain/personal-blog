import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import Header from '@/components/Header';
import SectionHero from '@/components/SectionHero';
import SectionCards from '@/components/SectionCards';
import SectionAbout from '@/components/SectionAbout';

export default function Home({ posts }) {
  // console.log(posts);
  return (
    <>
      <Header mainText="Justin Mountain" />
      <SectionHero />
      <SectionCards posts={posts} />
      <SectionAbout />
      <Header mainText="Copyright 2023 Justin Mountain" />
    </>
  );
};

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('posts'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8')
    const {data:frontmatter} = matter(markdownWithMeta) 

    return {
      filename, slug, frontmatter
    }
  })

  return {
    props: {
      posts,
    },
  };
};
