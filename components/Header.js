import React from 'react';
import Link from 'next/link';
import { useState } from "react";
import MainNav from './MainNav';

export default function Header({ mainText }) {

  const [btnState, setBtnState] = useState(false);
  let buttonAddClass = btnState ? '': 'hidden';

  function handleClick() {
    setBtnState(btnState => !btnState);
  };

  return (
    <header className="bg-gray-800 text-white sticky top-0 md:static">
      <div className='flex flex-col px-8 py-5 max-w-screen-2xl m-auto md:flex-row'>
        <div className="flex my-auto justify-between md:w-1/2 md:justify-start">
          <div>
            <h1 className='invert-link-color'>
              <Link href="/">{ mainText }</Link>
            </h1>
          </div>
          <button 
            className='my-auto justify-end md:hidden'
            onClick={handleClick}>
            <div>
              <div className='w-5 h-0.5 my-1 bg-white '></div>
              <div className='w-5 h-0.5 my-1 bg-white '></div>
              <div className='w-5 h-0.5 my-1 bg-white '></div>
            </div>
          </button> 
        </div>
        <div className={`md:w-1/2 justify-end md:flex absolute w-screen top-16 right-0 bg-gray-800 md:static md:pr-0 ${buttonAddClass}`}>
          <MainNav />
        </div>
      </div>
    </header>
  );
};
