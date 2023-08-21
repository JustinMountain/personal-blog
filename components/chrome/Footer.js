import React from 'react';
import Image from 'next/image';
import SocialLinks from '../utility/SocialLinks';
import CustomHeading from '../utility/CustomHeading';
import NavFooter from './NavFooter';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="flex flex-col max-w-screen-2xl mx-auto gap-4 px-2 pt-16 pb-8 md:py-16 md:flex-row
                          md:flex-row md:justify-between md:px-8">
        <div className="mx-auto md:w-64">
          <Image
              src="/posts/justin.jpg"
              width={400}
              height={400}
              title="Justin"
              alt="Justin"
              className="md:w-64"
          />    
        </div>
        <div className="sm:mx-auto md:grow">
          <div className="flex flex-col max-w-sm mx-auto sm:w-96 md:w-auto md:mx-0">
            <div>
              <CustomHeading size="h2" head="Justin Mountain" subhead="Junior Cloud Engineer" />
              AWS | Docker | React | Next.js
            </div>
            <div className="md:pl-1 md:pt-28">
              <SocialLinks align="left" fillColor="white" />
            </div>
          </div>
        </div>
        <div className="">
          <NavFooter />
        </div>
      </div>
    </footer>
  );
};
