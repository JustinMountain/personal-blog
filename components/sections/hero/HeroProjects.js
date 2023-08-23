import React from 'react';
import CustomHeading from '@/components/utility/CustomHeading';
import ProjectCard from '../projects/ProjectCard';
import SocialLinks from '@/components/utility/SocialLinks';

export default function HeroProjects({ posts }) {

  const filterResult = posts.filter(post => post.frontmatter.featured === "yes").slice(0, 2);

  return (
    <section className='bg-primary text-light px-4 py-16 m-auto
                          md:px-8 lg:py-24'>
      <div className="max-w-7xl mx-auto
                        md:grid md:grid-cols-4 md:gap-8
                        2xl:gap-32">
        <div className="max-w-lg mx-auto pb-16

                          md:col-start-1 md:col-end-3 md:pb-0 md:max-w-xl">
          <CustomHeading size="h2" head="Projects" subhead="Doing stuff and writing about it" />
          <p className="text-lg
                        md:max-w-xl md:pb-16
                        xl:text-xl">
            These articles exist between documentation for my personal projects, my lifelong passion for learning, and my experience teaching and communicating ideas. 
          </p>
          <div className="pt-8">
            <SocialLinks fillColor="white" discuss={true} />
          </div>
        </div>

        <div className="max-w-lg mx-auto 
                          md:col-start-3 md:col-end-5 md:max-w-xl">
          <div className="flex flex-col gap-8">
            <CustomHeading size="h3" head="Featured Projects" subhead="" />
            {filterResult.map((post, index) => (
              <ProjectCard key={index} frontmatter={post.frontmatter} slug={post.slug} bgColor="accent" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
