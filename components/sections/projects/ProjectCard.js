import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';

export default function ProjectCard({ index, frontmatter, slug }) {

  let repo;

  if (frontmatter.repo !== "") {
    repo = <Button content="Repository" href={frontmatter.repo} buttonType="light" target="_blank" />;
  }

  return (
    <div className="mx-auto border-2 border-primary">
      <div className="relative ">
        <Image
          src={`/projects/${frontmatter.thumbnail}`}
          width={576}
          height={384}
          alt={frontmatter.thumbalt}
        />
        <div className="absolute top-0 bg-gradient-to-b to-none w-full h-3/4 px-2 py-1 from-secondary" >
          <Link href={`/projects/${slug}`} passHref className="no-underline">
            <CustomHeading size="h3" head={frontmatter.title} subhead={frontmatter.tags} />
          </Link>
        </div>

        <div className="absolute bottom-6 right-4">
          <div className="flex justify-end gap-4">
            {repo}
            <Button content="Read More" href={`/projects/${slug}`} buttonType="light" />
          </div>
        </div>
      </div>
    </div> 
  ) 
}
