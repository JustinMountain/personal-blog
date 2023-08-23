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
    <section className='bg-secondary py-16 px-4 
                        md:px-8
                        lg:py-24'>
      <div className='mx-auto max-w-6xl
                      2xl:max-w-7xl'>
        <div className="max-w-lg mx-auto
                        md:max-w-7xl">
          <div className="pb-8">
            <CustomHeading size="h3" head="Filter all projects by tag:" subhead="" />
          </div>

          <div className='flex flex-wrap items-center gap-x-5 gap-y-8'>
            {uniqueTags.map((tag, index) => (
                <FilterCheckbox key={index} tag={tag} state={tagDictState} onChange={filterResult}/>
              ))}
          </div>
          <button className='flex bg-light px-4 py-2 my-6 ml-auto rounded text-xl active:bg-accent' 
            onClick={() => resetResult()}>Reset</button>
        </div>

        {/* Takes the first four posts and creates cards for them */}
        {data.map((post, index) => (
          <EachProject key={index} post={post} />
        ))}

        <div className="pt-8 max-w-lg mx-auto
                        md:max-w-7xl">
          <CustomHeading size="h3" head="End of List" subhead="Why not reset the list or read an article?" />
          <button className='bg-light px-4 py-2 mt-16 ml-auto rounded text-xl active:bg-accent' 
            onClick={() => resetResult()}>Reset</button>
        </div>
      </div>
    </section>
  )
}
