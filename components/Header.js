import React from 'react'
import Link from 'next/link'

export default function Header({ mainText }) {

  // Create an array containing all nav links
  // Loop/Map over the array to make the nav
    // https://www.youtube.com/watch?v=74ys-dT94mA


  return (
    <header className="bg-gray-800 text-white">
      <div className='flex p-4 max-w-screen-2xl m-auto'>
        <div className="flex p-2 w-1/2 justify-start">
          <div className="py-2">
            <h1 className='invert-link-color'>
              <Link href="/">{mainText}</Link>
            </h1>
          </div>
        </div>



        <nav className='flex p-2 w-1/2 justify-end'>
          <ul className="main-nav">
            <li className="invert-link-color">
              <Link href="/">Top</Link>
            </li>
            <li className="invert-link-color">
              <Link href="/">Contact</Link>
            </li>
          </ul>
          <label htmlFor="nav-toggle" className='py-2 my-auto justify-end md:hidden'>


            <div>
              <div className='w-5 h-0.5 my-1 bg-white '></div>
              <div className='w-5 h-0.5 my-1 bg-white '></div>
              <div className='w-5 h-0.5 my-1 bg-white '></div>
            </div>






          </label>
        </nav>
      </div>
      <input type="checkbox" id="nav-toggle" className="hidden" />
    </header>
  )
}
