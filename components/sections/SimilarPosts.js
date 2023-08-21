import React from 'react'
import ProjectCard from './projects/ProjectCard';
import CustomHeading from '../utility/CustomHeading';

export default function SimilarPosts({ thisPost, similarPosts }) {

  return (
    <div className="ml-2">

      <CustomHeading size="h3" head="Similar Posts" subhead="" />

      {similarPosts.slice(0, 3).map((post, index) => (
        <div className="py-4" key={index} >
          <ProjectCard frontmatter={post.frontmatter} slug={post.slug} bgColor="light" />
        </div>        
      ))}
    </div>
  ) 
}

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
