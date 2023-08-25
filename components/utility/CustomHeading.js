import React from "react";

export default function CustomHeading({ size, head, subhead }) {
  
  let heading;
  let subheading;
  const sublength = subhead.length;

  switch (size) {
    case "h2":
      heading = <h2 className='pt-0 text-3xl xl:text-4xl'> { head } </h2>;
      break;
    
    case "h3":
      heading = <h3 className='pt-0 text-2xl xl:text-3xl'> { head } </h3>;
      break;

    case "h4":
      heading = <h4 className='pt-0 text-xl xl:text-2xl'> { head } </h4>;
      break;

    case "h5":
      heading = <h5 className='pt-0 text-lg xl:text-xl'> { head } </h5>;
      break;

    case "h6":
      heading = <h6 className='pt-0'> { head } </h6>;
      break;
  }

  if (sublength >= 1 ) {
    subheading = `// ${subhead}`;
  } 
  else {
    subheading = "";
  }

  return (
    <div>
      <div before={`${subheading}`} className={`before:text-accent before:content-[attr(before)] before:text-md
                                                before:lg:text-lg
                                                text-light`}>
        { heading }
      </div>
    </div>
  );
};
