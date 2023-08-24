import React from 'react';
import Image from 'next/image';
import CustomHeading from '@/components/utility/CustomHeading';
import SocialLinks from '../utility/SocialLinks';

export default function ContactResponse() {

  return (
    <section className='bg-primary text-light text-center px-4 py-16 m-auto 
                        md:text-left md:px-8
                        lg:px-24 lg:py-24'>
      <div className="max-w-7xl mx-auto
                        md:grid md:grid-cols-2 md:gap-8
                        2xl:gap-32">
        <div className="max-w-lg mx-auto pt-4 text-left 
                        md:col-start-1 md:col-end-2 md:max-w-xl md:pt-8
                        lg:pt-16
                        xl:pt-24">
          <CustomHeading size="h2" head="Thank you for expressing interest in working together!" subhead="I'll get back to you soon." />

          <p className="text-lg pb-8 my-8
                        md:max-w-xl md:pb-4
                        xl:text-xl">
            Until then check out one of the articles I&apos;ve written or connect on one of my socials.
          </p>
          
          <div className="md:hidden">
            <SocialLinks align="left" bgColor="primary" />
          </div>

          <div className="hidden 
                          md:inline">
            <SocialLinks align="left" bgColor="primary" />
          </div>
        </div>

        <div className="max-w-lg mx-auto 
                        md:col-start-2 md:col-end-3 md:max-w-xl">
          <Image
            src="/posts/justin.jpg"
            width={576}
            height={576}
            title="Justin"
            alt="Justin"
            className="pt-16 mx-auto rounded-lg
                        md:pt-0" />
        </div>
      </div>
    </section>
  )
}
