import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingByDate } from '../utils/sort';

import Header from '@/components/Header';
import SectionProjectsHero from '@/components/SectionProjectsHero';
import SectionFeaturedProjects from '@/components/SectionFeaturedProjects';
import SectionAbout from '@/components/SectionAbout';
import Footer from '@/components/Footer';

export default function Projects({ posts }) {
  return (
    <>
      <Header />
      <SectionProjectsHero />
      <SectionFeaturedProjects posts={posts} />
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
