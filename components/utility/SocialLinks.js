import React from 'react';
import Link from 'next/link';

import IconGitHub from '@/public/icons/IconGitHub';
import IconLinkedIn from '@/public/icons/IconLinkedIn';
import IconEmail from '@/public/icons/IconEmail';
import IconDiscord from '@/public/icons/IconDiscord';

export default function SocialLinks({ align, bgColor }) {

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
    <div>
      <div className={`flex ${alignment} gap-8 items-center text-lg
                        md:max-w-xl md:gap-6
                        xl:text-xl`}>
        <Link href="https://github.com/JustinMountain" passHref>
          <IconGitHub 
          fill={ '#FFF' }
          width="40" />          
        </Link>
        <Link href="https://www.linkedin.com/in/justinmountain/" passHref>
          <IconLinkedIn 
            fill={ '#FFF' }
            width="40" />
        </Link>
        <Link href="https://discord.gg/PTy7Jm7hf" passHref>
          <IconDiscord 
            fill={ '#FFF' }
            bgColor={ bgColor }
            width="40" />
        </Link>
        <Link href="mailto:mountainj@gmail.com" passHref>
          <IconEmail 
            fill={ '#FFF' }
            width="40" />
        </Link>
      </div>
    </div>
  );
};
