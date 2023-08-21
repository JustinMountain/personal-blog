import React from 'react';

import FeaturedProject from './FeaturedProject';

export default function ProjectsFeatured({ posts }) {

  const filterResult = posts.filter(post => post.frontmatter.featured === "yes");

  return (
    <section className='bg-secondary pt-2 pb-2 px-8 '>
      <div className='m-auto max-w-screen-2xl'>

        <h2 className="text-center text-white pt-16 pb-8">Featured Projects</h2>

        {filterResult.map((post, index) => (
          <FeaturedProject key={index} post={post} index={index} />
        ))}

      </div>
    </section>
  )
}
