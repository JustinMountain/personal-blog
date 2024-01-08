import React from 'react';
import Image from 'next/image';
import SocialLinks from '@/components/utility/SocialLinks';
import CustomHeading from '@/components/utility/CustomHeading';

export default function HeroHome() {
  return (
    <section className='bg-primary text-light px-4 py-16 m-auto
                        md:text-left md:px-8
                        lg:py-24'>
      <div className="max-w-7xl mx-auto
                        md:grid md:grid-cols-2 md:gap-8
                        2xl:gap-32">
        <div className="max-w-lg mx-auto 
                        md:col-start-1 md:col-end-2 md:max-w-xl">
          <Image
            src="/images/justin.jpg"
            width={576}
            height={576}
            title="Justin"
            alt="Justin"
            className="mx-auto rounded-lg" />
        </div>
        

        <div className="max-w-lg mx-auto pt-16 
                        md:col-start-2 md:col-end-3 md:max-w-xl md:pt-12
                        lg:pt-24
                        xl:pt-32">
          <CustomHeading size="h2" head="Hi, I'm Justin" subhead="Junior Developer" />

          <p className="text-lg py-4
                        md:max-w-xl md:py-4
                        lg:pt-8">
            This is where I share my passion for learning. 
          </p>
          <p className="text-lg py-4
                        md:max-w-xl md:pt-4 md:pb-8
                        lg:pb-16">
            I write articles about homelab, self-hosting, the cloud, full stack web development, and DevOps.
          </p>
          
          <div className="max-w-xs mx-auto pt-8
                          md:hidden">
            <SocialLinks align="center" bgColor="primary" />
          </div>

          <div className="hidden 
                          md:inline">
            <SocialLinks align="left" bgColor="primary" />
          </div>
        </div>
      </div>
    </section>
  )
}
