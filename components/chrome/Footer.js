import React from 'react';
import Image from 'next/image';
import SocialLinks from '../utility/SocialLinks';
import CustomHeading from '../utility/CustomHeading';
import NavFooter from './NavFooter';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="flex flex-col max-w-7xl mx-auto gap-4 px-4 pt-16 pb-8 
                      md:py-16 md:flex-row md:flex-row md:justify-between md:px-8
                      lg:py-24
                      2xl:px-0">
        <div className="mx-auto 
                        md:w-64">
          <Image
              src="/images/justin.jpg"
              width={400}
              height={400}
              title="Justin"
              alt="Justin"
              className="md:w-64"
          />    
        </div>
        <div className="sm:mx-auto 
                        md:grow">
          <div className="flex flex-col max-w-sm mx-auto 
                          sm:w-96 
                          md:w-auto md:mx-0">
            <div>
              <CustomHeading size="h2" head="Justin Mountain" subhead="Junior Cloud Engineer" />
              <p className="text-lg pt-4 pb-2
                            lg:pb-1
                            xl:text-xl xl:pb-4">
                AWS | Docker | React | Next.js
              </p>
            </div>
            <div className="pt-8
                            md:pl-1 md:pt-24
                            xl:pt-20">
              <SocialLinks align="left" bgColor="primary" />
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
