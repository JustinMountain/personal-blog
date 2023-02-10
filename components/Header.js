import React from 'react'
import Link from 'next/link'

export default function Header({ mainText }) {
  return (
    <header className="bg-gray-800 text-white">
      <div className='flex p-4 max-w-screen-2xl m-auto'>
        <div className="flex p-2 w-1/2 justify-start align-middle">
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
          <label for="nav-toggle" className='py-2 justify-end md:hidden'>
              <div>A</div>
          </label>
        </nav>
      </div>
      <input type="checkbox" id="nav-toggle" className="hidden" />
    </header>
  )
}
