import React from 'react';
import Link from 'next/link';

import IconGitHub from '@/public/icons/IconGitHub';
import IconLinkedIn from '@/public/icons/IconLinkedIn';
import IconEmail from '@/public/icons/IconEmail';

export default function SocialLinks({ align, fillColor }) {

  let alignment;

  switch (align) {
    case "left":
      alignment = '';
      break;
    case "center":
      alignment = 'justify-around mx-auto';
      break;
    }
  
  return (
    <div className='flex'>
      <div className={`flex ${alignment} gap-4 pt-4`}>
        <Link href="https://github.com/JustinMountain">
          <IconGitHub fill={ fillColor } width="32" />
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
