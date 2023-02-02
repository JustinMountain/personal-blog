import React from 'react';

import Card from '@/components/Card';

export default function SectionCards({posts}) {
  console.log(posts)
  return (
    <section className='bg-gray-800 pt-2 pb-2 px-8 '>
      <div className='m-auto grid max-w-screen-2xl md:grid-cols-2 xl:grid-cols-4'>
        
        {posts.map((post, index) => (
          <Card key={index} post={post} />
        ))}

      </div>
    </section>
  )
}

