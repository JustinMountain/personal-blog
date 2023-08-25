import React from 'react';
import SocialLinks from '@/components/utility/SocialLinks';
import CustomHeading from '@/components/utility/CustomHeading';
import Image from 'next/image';
import Button from '@/components/utility/Button';

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
    <section className='bg-primary text-light px-4 py-16 m-auto 
                        md:text-left md:px-8
                        lg:py-24'>
      <div className="max-w-7xl mx-auto
                      lg:grid lg:grid-cols-2 lg:gap-8
                      2xl:gap-32">
        <div className="max-w-lg mx-auto 
                        md:col-start-1 md:col-end-2 md:max-w-xl">
          <CustomHeading size="h2" head={frontmatter.title} subhead={publishedLine} />

          <p className="text-lg
                        md:max-w-xl">
            {frontmatter.excerpt}
          </p>

          {frontmatter.excerpt2 !== "" ? (
            <p className="text-lg md:max-w-xl">{frontmatter.excerpt2}</p>
          ) : (
            ""
          )}

          <div className="pt-8 pb-4">
            {repo}
          </div>
          
          <div className="md:hidden">
            <div className="py-8">
              Discuss with me:
            </div>
            <SocialLinks align="left" bgColor="primary" />
          </div>
          <div className="hidden md:inline">
            <div className="py-8">
              Discuss with me:
            </div>
            <SocialLinks align="left" bgColor="primary" />
          </div> 
        </div>

        <div className="mx-auto pt-16 max-w-lg
                        md:col-start-2 md:col-end-3 md:max-w-xl lg:pt-0 ">
          <Image
            src={`/posts/${frontmatter.thumbnail}`}
            width={576}
            height={384}
            title={frontmatter.title}
            alt={frontmatter.thumbalt}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  )
}
