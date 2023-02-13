import React from 'react';
import SocialLinks from './SocialLinks';

export default function Footer({ mainText }) {

  return (
    <footer className="bg-gray-800 text-white sticky top-0 md:static">
      <div className='flex flex-col px-8 py-5 max-w-screen-2xl m-auto md:flex-row'>
        <div className="flex my-auto justify-between md:w-1/2 md:justify-start">
          <span className='invert-link-color'>
            {mainText}
          </span>
        </div>
        <nav className="md:w-1/2 justify-end md:flex absolute w-screen top-16 right-0 pr-8 bg-gray-800 md:static md:pr-0">
          <SocialLinks fillColor="white" />
        </nav>
      </div>
    </footer>
  );
};
