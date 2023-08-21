import React from 'react'
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({ index, frontmatter, slug }) {

  let repo;

  if (frontmatter.repo !== "") {
    repo = <Button content="Repository" href={frontmatter.repo} buttonType="light" />;
  }

  return (
    <div className="mx-auto">
      <div className="relative">
        <Image
          src={`/posts/${frontmatter.thumbnail}`}
          width={384}
          height={256}
          alt={frontmatter.thumbalt}
        />
        <div className="absolute top-0
                          bg-gradient-to-b from-secondary to-none w-full h-3/4 px-2 py-1">
          <Link href={`/posts/${slug}`} className="no-underline">
            <CustomHeading size="h3" head={frontmatter.title} subhead={frontmatter.tags} />
          </Link>
        </div>

        <div className="absolute bottom-6 right-4">
          <div className="flex justify-end gap-4">
            {repo}
            <Button content="Read More" href={`/posts/${slug}`} buttonType="light" />
          </div>
        </div>
      </div>
    </div> 
  ) 
}
