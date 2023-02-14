import React from "react";
import Link from 'next/link';

export default function NavMain() {

  const navLinks = [
    {name:"Blog", href:"/"},
    {name:"Contact", href:"mailto:mountainj@gmail.com"},
  ]

  const navHtml = navLinks.map((link, index) => (
    <li key={index} className="invert-link-color text-right my-auto py-8 pr-8 md:pr-0 md:py-0 md:mr-16 md:last:mr-0">
      <Link href={link.href}>
        {link.name}
      </Link>
    </li>
  ));

  return (
    <nav >
      <ul className="justify-center md:justify-end md:flex">
        {navHtml}
      </ul>
    </nav>
  );
};
