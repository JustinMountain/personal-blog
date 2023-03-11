import React from 'react';

import Project from '@/components/Project';

export default function SectionFeaturedProjects({ posts }) {
  return (
    <section className='bg-gray-800 pt-2 pb-2 px-8 '>
      <div className='m-auto max-w-screen-2xl'>

        <h2 className="text-center text-white pt-16 pb-8">Featured Projects</h2>

        {/* Takes the first four posts and creates cards for them */}
        {posts.slice(0, 3).map((post, index) => (
          <Project key={index} post={post} />
        ))}

      </div>
    </section>
  )
}
