import React from "react";
import Link from 'next/link';

export default function Button({ content, href, buttonType }) {

  let buttonStyle;

  switch (buttonType) {
    case "primary":    
      buttonStyle = "bg-primary dark-button hover:bg-light hover:light-button";
      break;
    case "secondary":
      buttonStyle = "bg-secondary dark-button hover:bg-light hover:light-button";
      break;
    case "accent":
      buttonStyle = "bg-accent light-button hover:bg-light hover:light-button";
      break;
    case "light":
      buttonStyle = "bg-light light-button hover:bg-accent hover:light-button";
      break;
    default:
      buttonStyle = "text-white px-0";
    }
  
  return (
    <Link href={`${href}`} className="no-underline">
      <span className={`rounded px-4 py-2 ${buttonStyle}`}>
        { content }
      </span>
    </Link>
  );
};
