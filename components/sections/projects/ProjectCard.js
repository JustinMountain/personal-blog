import React from 'react'
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';


export default function ProjectCard({ post }) {

  let repo;

  if (post.frontmatter.repo !== "") {
    repo = <Button content="Repository" href={post.frontmatter.repo} buttonType="light" />;
  }

  return (
    <div className="bg-[url(https://source.unsplash.com/random/600x400)] bg-cover text-left w-80 h-56 xs:w-96 xs:h-64 mx-auto">

      <div className="bg-gradient-to-b from-secondary to-none h-3/4 px-4 py-2">
        <CustomHeading size="h3" head={post.frontmatter.title} subhead={post.frontmatter.tags} />
      </div>

      <div className="flex justify-end mr-4 gap-4">
        {repo}
        <Button content="Read More" href={`/posts/${post.slug}`} buttonType="light" />
      </div>
    </div>
  ) 
}
