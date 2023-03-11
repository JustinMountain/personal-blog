import React from 'react'
import Link from 'next/link'

import TagList from './TagList';
import IconLink from '@/public/icons/IconLink';

export default function Project({ index, post }) {

  const tags = post.frontmatter.tags.split(', ');

  return (
    <div className='rounded w-11/12 lg:w-10/12 xl:w-3/4 mx-auto my-8 pt-6 pb-12 border-b-2 last:border-b-0 lg:grid lg:grid-cols-3 lg:gap-x-4'>

      <Link href={`/posts/${post.slug}`} className="no-underline flex items-center lg:col-start-1 lg:col-end-3">
        <h3 className='text-white align-baseline pr-4'>{post.frontmatter.title}</h3><IconLink stroke="none" fill="white" height="24px" />
      </Link>
      
      <h4 className='text-white lg:col-start-1 lg:col-end-3'>// {post.frontmatter.category}</h4>
      <p className='text-white py-8 lg:col-start-1 lg:col-end-3'>{post.frontmatter.excerpt}</p>

      <img className="w-full lg:w-fit lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-5" src="https://scatterjar.com/wp-content/uploads/2016/11/www.scatterjar.com-4851-2-350x233.jpg"></img>

      <TagList tags={tags} />
    </div>
  )
}
