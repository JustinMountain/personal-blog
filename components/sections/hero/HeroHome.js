import React from 'react'
import Head from 'next/head'
import SocialLinks from '@/components/utility/SocialLinks'

export default function HeroHome() {
  return (
    <section className='text-center p-16 max-w-sm m-auto'>
      <Head>
        <title>Justin Mountain</title>
      </Head>
      <h2>Hi, I&apos;m Justin</h2>
      <h3>Junior Developer</h3>
      <p>
        Currently pursuing interests in full stack web development and DevOps.
      </p>
      <SocialLinks fillColor="rgb(31 41 55)" />
    </section>
  )
}
