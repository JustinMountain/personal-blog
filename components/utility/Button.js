import React from "react";
import Link from 'next/link';

export default function Button({ content, href, buttonType, target }) {

  let buttonStyle;

  switch (buttonType) {
    case "primary":    
      buttonStyle = "bg-primary hover:bg-light hover:text-primary";
      break;
    case "secondary":
      buttonStyle = "bg-secondary hover:bg-light hover:text-secondary";
      break;
    case "accent":
      buttonStyle = "bg-accent text-primary hover:bg-light";
      break;
    case "light":
      buttonStyle = "bg-light text-primary hover:bg-accent";
      break;
    default:
      buttonStyle = "text-white px-0";
    }
  
  return (
    <Link href={`${href}`} passHref className="no-underline" target={target}>
      <span className={`rounded px-4 py-2 text-md lg:text-lg ${buttonStyle}`}>
        { content }
      </span>
    </Link>
  );
};
