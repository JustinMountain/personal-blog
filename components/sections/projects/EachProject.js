import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import CustomHeading from '@/components/utility/CustomHeading';
import Button from '@/components/utility/Button';

export default function EachProject({ post }) {

  let repo;

  if (post.frontmatter.repo !== "") {
    repo = <Button content="Repository" href={post.frontmatter.repo} buttonType="light" />;
  }

  return (
    <div className='mx-auto my-8 pt-2 pb-8 border-b-2 max-w-sm
                      xs:pb-10
                      md:grid md:grid-cols-2 md:max-w-screen-xl md:gap-4
                      lg:grid-cols-3 lg:gap-x-4'>

      <div className="md:col-start-1 md:col-end-2
                      lg:col-start-1 lg:col-end-3">
        <Link href={`/posts/${post.slug}`} className="no-underline">
          <CustomHeading size="h3" head={post.frontmatter.title} subhead={post.frontmatter.tags} />
        </Link>
      </div>
      
      {/* <h4 className='text-white 
                      lg:col-start-1 lg:col-end-3'>&#47;&#47; {post.frontmatter.category}</h4> */}

      <Link href={`/posts/${post.slug}`} className="w-full 
                                                      xs:pt-4
                                                      md:pt-2
                                                      md:w-fit md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-4 md:ml-8
                                                      lg:w-fit lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-5" >
        <Image
          src={`/posts/${post.frontmatter.thumbnail}`}
          width={384}
          height={256}
          title={post.frontmatter.title}
          alt={post.frontmatter.thumbalt}
          className="mx-auto"
        />
      </Link>

      <p className='text-white pt-4 pb-6
                      xs:pb-8
                      md:py-0
                      lg:col-start-1 lg:col-end-3'>{post.frontmatter.excerpt}
      </p>

      <div className="flex justify-end gap-4
                      md:justify-start
                      lg:mt-8">
        {repo}
        <Button content="Read More" href={`/posts/${post.slug}`} buttonType="light" />
      </div>
    </div>
  )
}
