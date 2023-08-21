import React from 'react'
import Head from 'next/head'
import CustomHeading from '@/components/utility/CustomHeading'
import ProjectCard from '../projects/ProjectCard'
import SocialLinks from '@/components/utility/SocialLinks'

export default function HeroProjects({ posts }) {

  const filterResult = posts.filter(post => post.frontmatter.featured === "yes").slice(0, 2);


  
  return (
    <section className='bg-primary text-light p-4 pt-8 pb-16 m-auto
                          md:px-8 md:py-16
                          xl:py-32'>
      <Head>
        <title>Projects - Justin Mountain</title>
      </Head>


      <div className="max-w-screen-2xl mx-auto
                        md:grid md:grid-cols-4 md:gap-2 md:gap-4
                        lg:grid-cols-4
                        xl:grid-cols-6 xl:px-0">
        <div className="max-w-sm mx-auto pb-16
                          md:col-start-1 md:col-end-3 md:pb-0
                          lg:col-start-1 lg:col-end-3
                          xl:col-start-2 xl:col-end-4">

          <CustomHeading size="h2" head="Projects" subhead="Doing stuff and writing about it" />
          <p className="">
            These articles exist between documentation for my personal projects, my lifelong passion for learning, and my experience teaching and communicating ideas. 
          </p>
          <div className="pt-8">
            <SocialLinks fillColor="white" discuss={true} />
          </div>
          
        </div>

        <div className="max-w-sm mx-auto 
                          md:col-start-3 md:col-end-5
                          lg:col-start-3 lg:col-end-5
                          xl:col-start-4 xl:col-end-6">

          <div className="flex flex-col gap-8">
            <CustomHeading size="h3" head="Featured Projects" subhead="" />
            {filterResult.map((post, index) => (
              <ProjectCard key={index} frontmatter={post.frontmatter} slug={post.slug} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
