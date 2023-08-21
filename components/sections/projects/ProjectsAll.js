import React from 'react';
import { useState } from 'react';

import EachProject from './EachProject';
import FilterCheckbox from './FilterCheckbox';
import CustomHeading from '@/components/utility/CustomHeading';

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
    <section className='bg-secondary pt-2 pb-2 px-4 
                        md:px-8'>
      <div className='max-w-screen-xl mx-auto'>

        <div className="max-w-sm mx-auto
                        md:max-w-screen-xl">
          <h3 className="text-light pt-16 pb-8">Filter all projects by tag:</h3>

          <div className='flex flex-wrap items-center gap-x-5 gap-y-8'>
            {uniqueTags.map((tag, index) => (
                <FilterCheckbox key={index} tag={tag} state={tagDictState} onChange={filterResult}/>
              ))}
          </div>
          <button className='flex bg-light px-4 py-2 mt-5 ml-auto rounded text-xl active:bg-accent' 
            onClick={() => resetResult()}>Reset</button>

        </div>


        {/* Takes the first four posts and creates cards for them */}
        {data.map((post, index) => (
          <EachProject key={index} post={post} />
        ))}

        <div className="pt-8 pb-16 max-w-sm mx-auto
                        md:max-w-screen-xl">
          <CustomHeading size="h3" head="End of List" subhead="Why not reset the list or read an article?" />
          <button className='bg-light px-4 py-2 mt-16 ml-auto rounded text-xl active:bg-accent' 
            onClick={() => resetResult()}>Reset</button>

        </div>

      </div>
    </section>
  )
}
