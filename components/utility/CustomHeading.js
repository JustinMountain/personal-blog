import React from "react";

export default function CustomHeading({ size, head, subhead }) {
  
  let heading;

  switch (size) {
    case "h2":
      heading = <h2 className='pt-5'> { head } </h2>;
      break;
    
    case "h3":
      heading = <h3 className='pt-5'> { head } </h3>;
      break;

    case "h4":
      heading = <h4 className='pt-5'> { head } </h4>;
      break;

    case "h5":
      heading = <h5 className='pt-5'> { head } </h5>;
      break;

    case "h6":
      heading = <h6 className='pt-5'> { head } </h6>;
      break;
  }

  return (
    <div>
      <div before={`// ${subhead}`} className={`before:text-accent before:content-[attr(before)] before:absolute before:h-10 before:rounded-full before:pb-8 
                                                  text-light`}>
      { heading }
      </div>
    </div>
  );
};
