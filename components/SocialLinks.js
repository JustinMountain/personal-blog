import React from 'react'
import Image from 'next/image'

import iconEmail from '../public/icons/icon-email.svg'
import iconGitHub from '../public/icons/icon-github.svg'
import iconLinkedIn from '../public/icons/icon-linkedin.svg'

function SocialLinks() {
  return (
    <div className='flex mt-8'>
      <div className='w-1/4'></div>
      <div className='flex justify-around w-1/2'>
        <Image src={iconGitHub} width="32" />
        <Image src={iconLinkedIn} width="32" />
        <Image src={iconEmail} width="32" />
      </div>
      <div className='w-1/4'></div>
    </div>
  )
}

export default SocialLinks
