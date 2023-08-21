import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';

export default function FeaturedProject({ index, post }) {

  let repo;
  let picSide = "md:col-start-1 md:col-end-2";
  let textSide = "md:col-start-2 md:col-end-3";

  if (post.frontmatter.repo !== "") {
    repo = <Button content="Repository" href={post.frontmatter.repo} buttonType="light" />;
  }

  if (index === 1) {
    picSide = "md:col-start-1 md:col-end-2";
    textSide = "md:col-start-2 md:col-end-3";
  } else {
    picSide = "md:col-start-2 md:col-end-3";
    textSide = "md:col-start-1 md:col-end-2";
  }

  return (
    <div className='mx-auto my-8 pt-2 pb-8 max-w-sm
                      xs:pb-10
                      md:grid md:grid-cols-2 md:max-w-screen-xl md:gap-8
                      lg:gap-16'>

      <div className={picSide}>
        <Link href={`/posts/${post.slug}`} passHref className="no-underline">
          <CustomHeading size="h3" head={post.frontmatter.title} subhead={post.frontmatter.tags} />
        </Link>
      </div>
      
      <Link href={`/posts/${post.slug}`} passHref className={`w-full 
                                                      xs:pt-4
                                                      md:pt-2
                                                      md:w-fit ${textSide} md:row-start-1 md:row-end-4`} >
        <Image
          src={`/posts/${post.frontmatter.thumbnail}`}
          width={600}
          height={400}
          title={post.frontmatter.title}
          alt={post.frontmatter.thumbalt}
          className="mx-auto"
        />
      </Link>

      <p className='text-white pt-4 pb-6
                      xs:pb-8
                      md:py-0'>{post.frontmatter.excerpt}
      </p>

      <div className="flex justify-end gap-4
                      md:justify-start">
        {repo}
        <Button content="Read More" href={`/posts/${post.slug}`} buttonType="light" />
      </div>
    </div>
  )
}
