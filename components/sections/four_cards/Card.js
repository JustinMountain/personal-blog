import React from 'react'
import Link from 'next/link'

export default function Card({ index, post }) {

  return (
    <div className='bg-gray-200 rounded w-72 text-center mx-auto my-8 py-6'>
      <h3>{post.frontmatter.title}</h3>
      <p>{post.frontmatter.excerpt}</p>
      <div className='btn btn-gray'>
        <Link href={`/posts/${post.slug}`}>
          Read More
        </Link>
      </div>
    </div>
  )
}
