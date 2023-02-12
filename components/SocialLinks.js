import React from 'react'
import Image from 'next/image'

import iconEmail from '../public/icons/icon-email.svg'
import iconGitHub from '../public/icons/icon-github.svg'
import iconLinkedIn from '../public/icons/icon-linkedin.svg'

export default function SocialLinks() {
  return (
    <div className='flex mt-8'>
      {/* <div className='w-1/4'></div> */}
      <div className='flex justify-around mx-auto gap-4'>
        <Image src={iconGitHub} alt="GitHub" width="32" />
        <Image src={iconLinkedIn} alt="LinkedIn" width="32" />
        <Image src={iconEmail} alt="Email me" width="32" />
      </div>
      {/* <div className='w-1/4'></div> */}
    </div>
  )
}
