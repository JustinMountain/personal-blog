import React from 'react'
import Header from '@/components/Header'
import SectionHero from '@/components/SectionHero'
import SectionCards from '@/components/SectionCards'
import SectionAbout from '@/components/SectionAbout'

function Home() {
  return (
    <>
      <Header mainText="Justin Mountain" />
      <SectionHero />
      <SectionCards />
      <SectionAbout />
      <Header mainText="Copyright 2023 Justin Mountain" />
    </>
  )
}

export default Home
