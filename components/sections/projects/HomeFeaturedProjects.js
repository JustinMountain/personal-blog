import React from 'react';
import Button from '@/components/utility/Button';
import CustomHeading from '@/components/utility/CustomHeading';

import FeaturedProject from './FeaturedProject';

export default function ProjectsFeatured({ posts }) {

  const filterResult = posts.filter(post => post.frontmatter.featured === "yes");

  return (
    <section className='bg-secondary py-24 px-8
                        lg:px-16'>
      <div className='m-auto max-w-screen-2xl'>

        <div className="text-center pb-4">
          <CustomHeading size="h2" head="Featured Projects" subhead="" />

        </div>

        {filterResult.map((post, index) => (
          <FeaturedProject key={index} post={post} index={index} />
        ))}

        <div className="flex justify-end">
          <Button content="All Projects" href="/projectrs" buttonType="accent" />
        </div>
      </div>
    </section>
  )
}
