import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingByDate } from '../utils/sort';
import Head from 'next/head'

import Header from '@/components/chrome/Header';
import SectionHero from '@/components/sections/hero/HeroHome';
import HomeFeaturedProjects from '@/components/sections/projects/HomeFeaturedProjects';
import Roadmap from '@/components/sections/Roadmap';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/chrome/Footer';

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>{`Justin Mountain`}</title>
      </Head>

      <Header />
      <SectionHero />
      <HomeFeaturedProjects posts={posts} />
      <Roadmap />
      <ContactForm />
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
