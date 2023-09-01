import React from 'react';
import Link from 'next/link';

import IconGitHub from '@/components/utility/icons/IconGitHub';
import IconLinkedIn from '@/components/utility/icons/IconLinkedIn';
import IconEmail from '@/components/utility/icons/IconEmail';
import IconDiscord from '@/components/utility/icons/IconDiscord';

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
        <Link href="https://github.com/JustinMountain" target="_blank" passHref>
          <IconGitHub 
          fill={ '#FFF' }
          width="40" />          
        </Link>
        <Link href="https://www.linkedin.com/in/justinmountain/" target="_blank" passHref>
          <IconLinkedIn 
            fill={ '#FFF' }
            width="40" />
        </Link>
        <Link href="https://discord.gg/PTy7Jm7hf" target="_blank" passHref>
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
