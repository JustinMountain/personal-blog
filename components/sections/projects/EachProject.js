import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';

export default function EachProject({ post }) {

  let repo;

  if (post.frontmatter.repo !== "") {
    repo = <Button content="Repository" href={post.frontmatter.repo} buttonType="light" target="_blank" />;
  }

  return (
    <div className='mx-auto my-8 pb-8 border-b-2 max-w-lg
                    xs:pb-10
                    md:grid md:grid-cols-2 md:max-w-7xl md:gap-4
                    xl:grid-cols-3 xl:gap-x-4 lg:my-16 lg:pb-16'>

      <div className="md:col-start-1 md:col-end-2
                      xl:col-start-1 xl:col-end-3">
        <Link href={`/projects/${post.slug}`} passHref className="no-underline">
          <CustomHeading size="h3" head={post.frontmatter.title} subhead={post.frontmatter.tags} />
        </Link>
      </div>
      
      <Link href={`/projects/${post.slug}`} passHref className="w-full 
                                                              xs:pt-4
                                                              md:pt-0
                                                              md:w-fit md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-4 md:ml-8
                                                              xl:w-fit xl:col-start-3 xl:col-end-4 xl:row-start-1 xl:row-end-5" >
        <Image
          src={`/projects/${post.frontmatter.thumbnail}`}
          width={512}
          height={341}
          title={post.frontmatter.title}
          alt={post.frontmatter.thumbalt}
          className="mx-auto"
        />
      </Link>

      <p className='text-white pt-4 pb-6 text-lg
                    xs:pb-8
                    md:py-0
                    xl:col-start-1 xl:col-end-3'>{post.frontmatter.excerpt}
      </p>

      <div className="flex justify-end gap-4
                      md:justify-start
                      lg:mt-8">
        {repo}
        <Button content="Read More" href={`/projects/${post.slug}`} buttonType="light" />
      </div>
    </div>
  )
}
