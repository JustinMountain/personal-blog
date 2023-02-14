import React from 'react';
import SocialLinks from './SocialLinks';

export default function Footer() {

  return (
    <footer className="bg-gray-800 text-white top-0">
      <div className='flex flex-col-reverse px-8 py-5 max-w-screen-2xl m-auto md:flex-row'>
        <div className="py-5 my-auto md:py-0 md:w-1/2">
          <div className="text-center md:text-left">
            <span className='invert-link-color'>
              <a href="#page-top">Copyright 2023 Justin Mountain</a>
            </span>
          </div>
        </div>
        <div className="bg-gray-800 py-5 md:py-0 md:w-1/2 md:justify-end md:flex md:static md:pr-0">
          <SocialLinks fillColor="white" />
        </div>
      </div>
    </footer>
  );
};
