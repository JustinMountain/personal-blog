import React from 'react';

import Card from '@/components/Card';

export default function Cards({ posts }) {
  return (
    <section className='bg-gray-800 pt-2 pb-2 px-8 '>
      <div className='m-auto grid max-w-screen-2xl md:grid-cols-2 xl:grid-cols-4'>

        {/* Takes the first four posts and creates cards for them */}
        {posts.slice(0, 4).map((post, index) => (
          <Card key={index} post={post} />
        ))}

      </div>
    </section>
  )
}
