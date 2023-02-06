import React from 'react'
import Link from 'next/link'
import { globalStyles } from '@/utils/globalStyles';

export default function Card({ index, post }) {

  return (
    <div className='bg-gray-200 rounded w-72 text-center m-auto my-8'>
      <h3 className={globalStyles.h3}>{post.frontmatter.title}</h3>
      <p className={globalStyles.p}>{post.frontmatter.excerpt}</p>
      <div className={globalStyles.darkButton}>
        <Link href={`/posts/${post.slug}`}>
          Read More
        </Link>
      </div>
    </div>
  )
}
