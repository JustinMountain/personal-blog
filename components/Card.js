import React from 'react'
import Link from 'next/link'

export default function Card({ index, post }) {

  return (
    <div className='bg-gray-200 rounded w-72 text-center m-auto my-8'>
      <h3 className='text-xl py-2'>{post.frontmatter.title}</h3>
      <p className='py-4'>{post.frontmatter.excerpt}</p>
      <div className='btn p-2 mx-20 mb-8 text-white bg-gray-800 rounded-lg hover:text-gray-800 hover:bg-white'>
        <Link href={`/posts/${post.slug}`}>
          Read More
        </Link>
      </div>
    </div>
  )
}
