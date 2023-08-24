import React from 'react';
import Button from '@/components/utility/Button';
import CustomHeading from '@/components/utility/CustomHeading';

import FeaturedProject from './projects/FeaturedProject';

export default function ProjectsFeatured({ posts }) {

  const filterResult = posts.filter(post => post.frontmatter.featured === "yes");

  return (
    <section className='bg-secondary py-16 px-8
                        lg:py-24'>
      <div className='m-auto max-w-6xl
                      2xl:max-w-7xl'>

        <div className="text-center">
          <CustomHeading size="h2" head="Featured Projects" subhead="" />
        </div>

        {filterResult.map((post, index) => (
          <FeaturedProject key={index} post={post} index={index} />
        ))}

        <div className="max-w-lg mx-auto flex 
                        md:max-w-full md:justify-end">
          <Button content="All Projects" href="/projectrs" buttonType="accent" />
        </div>
      </div>
    </section>
  )
}
