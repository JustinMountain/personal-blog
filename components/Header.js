import React from 'react'

const Header = (props) => {
  return (
    <header className="bg-gray-800 text-white">
      <div className='flex flex-col p-4 max-w-screen-2xl m-auto md:flex-row'>
        <div className="flex justify-center p-2 md:w-1/2 md:justify-start">
          {props.mainText}
        </div>
        <ul className="flex justify-center p-2 md:w-1/2 md:justify-end">
          <li className="mr-16">Top</li>
          <li>Contact</li>
        </ul>
      </div>
    </header>
  )
}

export default Header
