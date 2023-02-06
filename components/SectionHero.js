import React from 'react'
import Head from 'next/head'
import SocialLinks from '@/components/SocialLinks'

export default function SectionHero() {
  return (
    <section className='text-center p-16 w-96 m-auto'>
      <Head>
        <title>Justin Mountain</title>
      </Head>
      <h2 className='text-3xl py-2'>Hi, I&apos;m Justin</h2>
      <h3 className='text-3xl py-2'>Junior Developer</h3>
      <p className='py-4'>
        Currently pursuing interests in full stack web development and DevOps.
      </p>
      <SocialLinks />
    </section>
  )
}
