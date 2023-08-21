import React from 'react'
import Head from 'next/head'
import SocialLinks from '@/components/utility/SocialLinks'
import CustomHeading from '@/components/utility/CustomHeading'
import Image from 'next/image'
import Button from '@/components/utility/Button'

export default function HeroOneProject({ frontmatter }) {

  let repo;
  let publishedLine;

  if (frontmatter.published === frontmatter.updated) {
    publishedLine = "Published " + frontmatter.published;
  } else {
    publishedLine = "Updated " + frontmatter.updated + " && Originally Published " + frontmatter.published;
  }

  if (frontmatter.repo !== "") {
    repo = <Button content="Repository" href={frontmatter.repo} buttonType="light" />;
  }

  return (
    <section className='bg-primary text-light text-center px-4 py-16 m-auto 
                          md:text-left md:px-16
                          xl:px-24 xl:py-32'>
      <Head>
        <title>{frontmatter.title} - Justin Mountain</title>
      </Head>

      <div className="max-w-screen-2xl mx-auto
                        md:grid md:grid-cols-2 md:gap-8">
                           
        <div className="max-w-sm mx-auto 
                          md:col-start-1 md:col-end-2 md:max-w-lg">
          <CustomHeading size="h2" head={frontmatter.title} subhead={publishedLine} />

          <p>
            {frontmatter.excerpt}
          </p>

          <div className="pt-8 pb-4">
            {repo}
          </div>
          
          <div className="md:hidden">
            <SocialLinks align="center" fillColor="white" discuss={true} />
          </div>
          <div className="hidden md:inline">
            <SocialLinks align="left" fillColor="white" discuss={true} />
          </div> 
        </div>

        <div className="mx-auto pt-16
                          md:col-start-2 md:col-end-3 md:pt-0 lg:ml-0">
          <Image
            src={`/posts/${frontmatter.thumbnail}`}
            width={600}
            height={400}
            title={frontmatter.title}
            alt={frontmatter.thumbalt}
            className="mx-auto"
          />
        </div>


      </div>
    </section>
  )
}
