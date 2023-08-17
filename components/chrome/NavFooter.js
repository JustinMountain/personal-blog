import React from "react";
import Button from "../utility/Button";

export default function NavFooter() {

  const navLinks = [
    {name:"Top", href:"#top", color:"primary"},
    {name:"Home", href:"/", color:"primary"},
    {name:"Projects", href:"/projects", color:"primary"},
    {name:"Contact", href:"mailto:mountainj@gmail.com", color:"accent"},
  ]

  const navHtml = navLinks.map((link, index) => (
    <li key={index} className="flex flex-row justify-center py-8 w-1/2
                                md:w-16 md:justify-end md:ml-auto md:pt-4 md:first:pt-0 md:last:pb-0">
      <Button content={link.name} href={link.href} buttonType={link.color} />
    </li>
  ));

  return (
    <nav>
      <ul className="justify-center flex-wrap flex pt-6 mx-auto sm:w-96 md:w-32
                      md:p-0 md:flex-col">
        {navHtml}
      </ul>
    </nav>
  );
};
