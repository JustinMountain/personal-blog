import React from 'react'
import Head from 'next/head'
import SocialLinks from '@/components/SocialLinks'

function SectionHero() {
  return (
    <section>
      <Head>
        <title>Justin Mountain</title>
      </Head>
      <div className='text-center p-16 w-96 m-auto'>
        <h2 className='text-3xl'>Hi, I'm Justin</h2>
        <h3 className='text-xl p-2'>Junior Developer</h3>
        <p className='pt-4'>
          Currently pursuing interests in full stack web development and DevOps.
        </p>
        <SocialLinks />
      </div>
    </section>
  )
}

export default SectionHero