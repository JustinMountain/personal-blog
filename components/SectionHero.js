import React from 'react'
import Head from 'next/head'
import SocialLinks from '@/components/SocialLinks'
import { globalStyles } from '@/utils/globalStyles';

export default function SectionHero() {
  return (
    <section className='text-center p-16 w-96 m-auto'>
      <Head>
        <title>Justin Mountain</title>
      </Head>
      <h2 className={globalStyles.h2}>Hi, I&apos;m Justin</h2>
      <h3 className={globalStyles.h3}>Junior Developer</h3>
      <p className={globalStyles.p}>
        Currently pursuing interests in full stack web development and DevOps.
      </p>
      <SocialLinks />
    </section>
  )
}
