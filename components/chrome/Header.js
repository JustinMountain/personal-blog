import React from 'react';
import { useState } from "react";
import Link from 'next/link';
import MainNav from './NavMain';
import Button from '../utility/Button';

export default function Header() {

  const [btnState, setBtnState] = useState(false);
  let buttonAddClass = btnState ? '': 'hidden';

  function handleClick() {
    setBtnState(btnState => !btnState);
  };

  return (
    <header className="bg-primary text-light top-0" id="top">
      <div className='flex flex-col px-0 pr-4 py-5 max-w-screen-2xl m-auto 
                        md:flex-row md:pl-4 md:pr-8'>
        <div className="flex my-auto justify-between 
                          md:w-1/2 md:justify-start">
          <div>
            <h1 className='control-link-color pl-4'>
              <Link href="/">
                Justin Mountain
              </Link>
            </h1>
          </div>
          <button 
            className='my-auto justify-end 
                        md:hidden'
            onClick={handleClick}>
            <div>
              <div className='bg-light w-5 h-0.5 my-1'></div>
              <div className='bg-light w-5 h-0.5 my-1'></div>
              <div className='bg-light w-5 h-0.5 my-1'></div>
            </div>
          </button> 
        </div>
        <div className={`bg-primary justify-end absolute w-screen top-16 right-0 pb-8
                          md:flex md:w-1/2 md:static md:pr-0 md:pb-0 ${buttonAddClass}`}>
          <MainNav />
        </div>
      </div>
    </header>
  );
};
