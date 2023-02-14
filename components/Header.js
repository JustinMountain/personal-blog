import React from 'react';
import Link from 'next/link';
import { useState } from "react";
import MainNav from './NavMain';

export default function Header() {

  const [btnState, setBtnState] = useState(false);
  let buttonAddClass = btnState ? '': 'hidden';

  function handleClick() {
    setBtnState(btnState => !btnState);
  };

  return (
    <header id="page-top" className="bg-gray-800 text-white top-0">
      <div className='flex flex-col px-8 py-5 max-w-screen-2xl m-auto md:flex-row'>
        <div className="flex my-auto justify-between md:w-1/2 md:justify-start">
          <div>
            <h1 className='invert-link-color'>
              <Link href="/">Justin Mountain</Link>
            </h1>
          </div>
          <button 
            className='my-auto justify-end md:hidden'
            onClick={handleClick}>
            <div>
              <div className='bg-white w-5 h-0.5 my-1'></div>
              <div className='bg-white w-5 h-0.5 my-1'></div>
              <div className='bg-white w-5 h-0.5 my-1'></div>
            </div>
          </button> 
        </div>
        <div className={`bg-gray-800 justify-end absolute w-screen top-16 right-0 md:flex md:w-1/2 md:static md:pr-0 ${buttonAddClass}`}>
          <MainNav />
        </div>
      </div>
    </header>
  );
};
