import React from 'react'
import Link from 'next/link'
import CustomHeading from '@/components/utility/CustomHeading';
import ProjectTagList from './ProjectTagList';
import Button from '@/components/utility/Button';

export default function Project({ index, post }) {

  const tags = post.frontmatter.tags.split(', ');

  return (
    <div className='mx-auto my-8 pt-6 pb-12 border-b-2 max-w-screen-xl
                      lg:grid lg:grid-cols-3 lg:gap-x-4'>

      <div className="lg:col-start-1 lg:col-end-3">
        <Link href={`/posts/${post.slug}`} className="no-underline hover:underline hover:decoration-accent">
          <CustomHeading size="h3" head={post.frontmatter.title} subhead={post.frontmatter.tags} />
        </Link>
      </div>

      
      {/* <h4 className='text-white 
                      lg:col-start-1 lg:col-end-3'>&#47;&#47; {post.frontmatter.category}</h4> */}
      <p className='text-white py-8 
                      lg:col-start-1 lg:col-end-3'>{post.frontmatter.excerpt}</p>

      <Link href={`/posts/${post.slug}`} className="w-full 
                                                      lg:w-fit lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-5" >
        <img src={"/posts/" + post.frontmatter.thumbnail} alt={post.frontmatter.thumbnailAlt} title={post.frontmatter.title}></img>
      </Link>

      <Button content="Read More" href={`/posts/${post.slug}`} buttonType="light" />

      {/* <ProjectTagList tags={tags} /> */}
    </div>
  )
}
