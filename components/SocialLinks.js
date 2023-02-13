import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import IconGitHub from '@/public/icons/IconGitHub';
import IconLinkedIn from '@/public/icons/IconLinkedIn';
import IconEmail from '@/public/icons/IconEmail';

export default function SocialLinks({ fillColor }) {
  return (
    <div className='flex'>
      <div className='flex justify-around mx-auto gap-4'>
        <Link href="https://github.com/JustinMountain">
          <IconGitHub fill={ fillColor } width="32px" />
        </Link>
        <Link href="https://www.linkedin.com/in/justinmountain/">
          <IconLinkedIn fill={ fillColor } width="32" />
        </Link>
        <Link href="mailto:mountainj@gmail.com">
          <IconEmail fill={ fillColor } width="32" />
        </Link>
      </div>
    </div>
  );
};

// I should create an array to map over to create the Link elements