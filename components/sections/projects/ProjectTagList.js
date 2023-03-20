import React from 'react'

export default function ProjectTagList({ tags }) {

  // Outputs all tags is a list
  return (
    <div className='flex flex-wrap items-center lg:col-start-1 lg:col-end-3'>
      {tags.map(tag => (
        <span className='bg-white px-3 py-0.5 mr-2 mt-4 lg:my-1 last:mr-0 rounded' key={tag}>{tag}</span>
      ))}
    </div>
  )
}
