import React from 'react'

export default function SectionAbout() {
  return (
    <section className='text-center py-16 px-8 m-auto md:px-16'>
      <h2 className='text-3xl py-2'>About</h2>
      <div className='m-auto grid max-w-screen-2xl md:grid-cols-2'>
        <div>
        </div>
        <div className='text-left max-w-md m-auto md:ml-0 md:max-w-2xl'>
          <p className='py-4'>
            As an educator, I spent nearly 10 years living and working in Japan, South Korea, and Brazil immersing myself in different languages, cultures, and ways of thinking.
          </p>
          <p className='py-4'>
            I&apos;ve since taken the leap into computer science, quickly picking up new concepts and finding ways to apply them. I&apos;m a determined, curious, and passionate learner excited by these new-to-me ideas.
          </p>
        </div>
      </div>
    </section>
  )
}
