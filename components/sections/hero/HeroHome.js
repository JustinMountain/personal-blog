import React from 'react'
import Head from 'next/head'
import SocialLinks from '@/components/utility/SocialLinks'
import CustomHeading from '@/components/utility/CustomHeading'

export default function HeroHome() {

  return (
    <section className='bg-primary text-light text-center px-4 py-16 m-auto 
                          md:text-left 
                          xl:py-32'>
      <Head>
        <title>Justin Mountain</title>
      </Head>

      <div className="max-w-screen-2xl mx-auto
                        md:grid md:grid-cols-2 md:gap-8 
                        xl:grid-cols-6">
        <img src="https://source.unsplash.com/random/400x400" 
              className="mx-auto 
                          md:col-start-1 md:col-end-2 
                          xl:col-start-2 xl:col-end-4" />

        <div className="max-w-sm mx-auto pt-16 
                          md:col-start-2 md:col-end-3 md:w-max 
                          xl:col-start-4 xl:col-end-6">
          <CustomHeading size="h2" head="Hi, I'm Justin" subhead="Junior Cloud Engineer" />

          <p>
            Currently pursuing interests in full stack web development and DevOps.
          </p>
          <div className="md:hidden">
            <SocialLinks align="center" fillColor="white" />
          </div>
          <div className="hidden md:inline">
            <SocialLinks align="left" fillColor="white" />
          </div>
        </div>
      </div>
    </section>
  )
}
