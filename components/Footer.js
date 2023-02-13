import React from 'react';
import SocialLinks from './SocialLinks';

export default function Footer({ mainText }) {

  return (
    <footer className="bg-gray-800 text-white sticky top-0 md:static">
      <div className='flex flex-col-reverse px-8 py-5 max-w-screen-2xl m-auto md:flex-row'>
        <div className="py-5 md:py-0 my-auto text-center md:w-1/2 md:text-left">
          <span className='invert-link-color'>
            {mainText}
          </span>
        </div>
        <div className="py-5 md:py-0 md:w-1/2 md:justify-end md:flex bg-gray-800 md:static md:pr-0">
          <SocialLinks fillColor="white" />
        </div>
      </div>
    </footer>
  );
};
