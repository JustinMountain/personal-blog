import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';

export default function FeaturedProject({ index, post }) {

  let repo;
  let picSide;
  let textSide;

  if (post.frontmatter.repo !== "") {
    repo = <Button content="Repository" href={post.frontmatter.repo} buttonType="light" target="_blank" />;
  }

  if (index === 1) {
    picSide = "lg:col-start-1 lg:col-end-2";
    textSide = "lg:col-start-2 lg:col-end-3";
  } else {
    picSide = "lg:col-start-2 lg:col-end-3";
    textSide = "lg:col-start-1 lg:col-end-2";
  }

  return (
    <div className='mx-auto my-8 max-w-lg
                    md:max-w-xl
                    lg:grid lg:grid-cols-2 lg:grid-rows-[1fr_2fr_2fr_1fr] lg:max-w-screen-xl lg:gap-x-16 lg:gap-y-4 lg:my-12 lg:my-16
                    xl:gap-x-32'>

      <div className={picSide}>
        <Link href={`/posts/${post.slug}`} passHref className="no-underline">
          <CustomHeading size="h3" head={post.frontmatter.title} subhead={post.frontmatter.tags} />
        </Link>
      </div>
      
      <Link href={`/posts/${post.slug}`} passHref className={`w-full 
                                                      xs:pt-4
                                                      lg:pt-2
                                                      lg:w-fit ${textSide} lg:row-start-1 lg:row-end-5`} >
        <Image
          src={`/posts/${post.frontmatter.thumbnail}`}
          width={576}
          height={384}
          title={post.frontmatter.title}
          alt={post.frontmatter.thumbalt}
          className="mx-auto"
        />
      </Link>

      <p className='text-white py-4 text-lg
                    lg:py-0'>
        {post.frontmatter.excerpt}
      </p>
      <p className='text-white py-4 text-lg
                    lg:py-0'>
        {post.frontmatter.excerpt2}
      </p>

      <div className="flex justify-end gap-4 mt-4
                      lg:justify-start lg:mt-0">
        {repo}
        <Button content="Read More" href={`/posts/${post.slug}`} buttonType="light" />
      </div>
    </div>
  )
}
