import React from "react";
import Button from "../utility/Button";

export default function NavMain() {

  const navLinks = [
    {name:"Home", href:"/", color:"primary"},
    {name:"Projects", href:"/projects", color:"primary"},
    {name:"Contact", href:"mailto:mountainj@gmail.com", color:"accent"},
  ]

  const navHtml = navLinks.map((link, index) => (
    <li key={index} className="text-right flex justify-end py-8 pr-6 
                                md:pl-4 md:pr-0 md:py-2 md:mr-8 md:last:mr-0">
      <Button content={link.name} href={link.href} buttonType={link.color} />
    </li>
  ));

  return (
    <nav>
      <ul className="justify-center 
                      md:justify-end md:flex">
        {navHtml}
      </ul>
    </nav>
  );
};
