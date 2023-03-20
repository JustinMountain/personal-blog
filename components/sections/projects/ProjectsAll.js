import React from 'react';
import { useState } from 'react';

import Project from './Project';
import FilterCheckbox from './FilterCheckbox';

export default function ProjectsAll({ posts }) {
  const [data, setData] = useState(posts);

  // Filter posts by multiple tags
  const filterResult = (tagNames) => {
    const result = posts.filter((curData) => {
      return tagNames.every((tagName) => {
        return curData.frontmatter.tags.includes(tagName);
      });
    });
    setData(result);
  }  

  // Reset displayed posts, state variable, and checkboxes
  const resetResult = () => {
    filterResult([]);

    // Sets each tag to false
    Object.keys(tagDictState).forEach((key) => {
      tagDictState[key] = false;
    });

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  // Find all unique tags
  let tagsArray = [];
  posts.forEach(post => {
    tagsArray = tagsArray.concat(post.frontmatter.tags.split(', '));
  });

  const uniqueTags = [...new Set(tagsArray)];

  // Create a dictionary of tags and set them to false
  const tagDictionary = uniqueTags.reduce((acc, curr) => {
    acc[curr] = false;
    return acc;
  }, {});

  // Create a state for the tag dictionary to be passed into filter checkbox
  const [tagDictState] = useState(tagDictionary);

  return (
    <section className='bg-gray-800 pt-2 pb-2 px-8 '>
      <div className='m-auto max-w-screen-2xl'>

        <h2 className="text-center text-white pt-16 pb-8">Featured Projects</h2>

        <div className='flex flex-wrap items-center justify-center m-auto gap-2 lg:col-start-1 lg:col-end-3'>

        <button className='bg-white px-3 py-0.5 mr-2 mt-4 lg:my-1 last:mr-0 rounded active:bg-violet-700' 
          onClick={() => resetResult()}>Reset</button> 

          {uniqueTags.map((tag, index) => (

            <FilterCheckbox key={index} tag={tag} state={tagDictState} onChange={filterResult}/>

          ))}
        </div>


        {/* Takes the first four posts and creates cards for them */}
        {data.map((post, index) => (
          <Project key={index} post={post} />
        ))}

      </div>
    </section>
  )
}

// look into passing state into a component to look into simplifying the code a bit