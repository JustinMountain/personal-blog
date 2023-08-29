import React from "react";
import { useState } from 'react';

export default function IconDiscord(props) {
  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
 
  const width = props.width;
  let fill = props.fill;
  const hoverFill = '#FFD369';
   
  return (
   <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>

      {isHovering ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={width} fill={hoverFill} >
          <path d="M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6 9.6-4.298 9.6-9.6S15.302.4 10 .4zM6.231 7h7.52c.399 0 .193.512-.024.643-.217.13-3.22 1.947-3.333 2.014s-.257.1-.403.1a.793.793 0 0 1-.402-.1L6.255 7.643C6.038 7.512 5.833 7 6.231 7zM14 12.5c0 .21-.252.5-.444.5H6.444C6.252 13 6 12.71 6 12.5V8.853c0-.092-.002-.211.172-.11l3.417 2.015a.69.69 0 0 0 .402.1.69.69 0 0 0 .403-.1l3.434-2.014c.174-.102.172.018.172.11V12.5z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={width} fill={fill} >
          <path d="M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6 9.6-4.298 9.6-9.6S15.302.4 10 .4zM6.231 7h7.52c.399 0 .193.512-.024.643-.217.13-3.22 1.947-3.333 2.014s-.257.1-.403.1a.793.793 0 0 1-.402-.1L6.255 7.643C6.038 7.512 5.833 7 6.231 7zM14 12.5c0 .21-.252.5-.444.5H6.444C6.252 13 6 12.71 6 12.5V8.853c0-.092-.002-.211.172-.11l3.417 2.015a.69.69 0 0 0 .402.1.69.69 0 0 0 .403-.1l3.434-2.014c.174-.102.172.018.172.11V12.5z" />
        </svg>
      )}
   </div>
  )
}
