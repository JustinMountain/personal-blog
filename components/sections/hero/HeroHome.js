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
            src="/posts/justin.jpg"
            width={576}
            height={576}
            title="Justin"
            alt="Justin"
            className="mx-auto rounded-lg" />
        </div>
        

        <div className="max-w-lg mx-auto pt-16 
                        md:col-start-2 md:col-end-3 md:max-w-xl
                        lg:pt-24
                        xl:pt-32">
          <CustomHeading size="h2" head="Hi, I'm Justin" subhead="Junior Cloud Engineer" />

          <p className="text-lg
                        md:max-w-xl md:pb-16
                        xl:text-xl">
            Currently pursuing interests in full stack web development and DevOps.
          </p>
          
          <div className="md:hidden">
            <SocialLinks align="center" fillColor="white" />
          </div>

          <div className="hidden 
                          md:inline">
            <SocialLinks align="left" fillColor="white" />
          </div>
        </div>
      </div>
    </section>
  )
}
