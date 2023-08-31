import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { sortDescendingByDate } from '../utils/sort';
import Head from 'next/head';
import Header from '@/components/chrome/Header';
import ContactResponse from '@/components/sections/ContactResponse';
import ProjectsAll from '@/components/sections/ProjectsAll';
import Footer from '@/components/chrome/Footer';

export default function Connected({posts}) {
  return (
    <>
      <Head>
        <title>Connected - Justin Mountain</title>
      </Head>

      <Header />
      <ContactResponse />
      <ProjectsAll posts={posts} />
      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const files = fs.readdirSync(path.join('projects'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const markdownWithMeta = fs.readFileSync(path.join('projects', filename), 'utf-8')
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
