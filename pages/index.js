import React from 'react'
import Header from '@/components/Header'
import SectionHero from '@/components/SectionHero'
import SectionCards from '@/components/SectionCards'

function Home() {
  return (
    <>
      <Header mainText="Justin Mountain" />
      <SectionHero />
      <SectionCards />
      <Header mainText="Copyright 2023 Justin Mountain" />
    </>
  )
}

export default Home
