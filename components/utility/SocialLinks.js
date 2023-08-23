import React from 'react';
import Link from 'next/link';

import IconGitHub from '@/public/icons/IconGitHub';
import IconLinkedIn from '@/public/icons/IconLinkedIn';
import IconEmail from '@/public/icons/IconEmail';

export default function SocialLinks({ align, fillColor, discuss }) {

  let alignment;
  let discussText = "";

  if (discuss) {
    discussText = "Discuss with me:";
  }
  

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
      <div className={`flex ${alignment} gap-4 items-center text-lg
                        md:max-w-xl
                        xl:text-xl`}>
        { discussText }
        <Link href="https://github.com/JustinMountain" passHref>
          <IconGitHub fill={ fillColor } width="32" />
        </Link>
        <Link href="https://www.linkedin.com/in/justinmountain/" passHref>
          <IconLinkedIn fill={ fillColor } width="32" />
        </Link>
        <Link href="mailto:mountainj@gmail.com" passHref>
          <IconEmail fill={ fillColor } width="32" />
        </Link>
      </div>
    </div>
  );
};
