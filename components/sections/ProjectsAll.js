import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import Project from '@/components/Project';

// export default function ProjectsAll({ posts }) {
//   const [data, setData] = useState(posts);
//   const [selectedTags, setSelectedTags] = useState([]);

//   const handleCheckboxChange = (event) => {
//     const tagName = event.target.value;
//     if (event.target.checked) {
//       setSelectedTags([...selectedTags, tagName]);
//     } else {
//       setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
//     }
//   };

//   useEffect(() => {
//     if (selectedTags.length === 0) {
//       setData(posts);
//       return;
//     }

//     const result = posts.filter((curData) => {
//       return selectedTags.some((tag) =>
//         curData.frontmatter.tags.includes(tag)
//       );
//     });

//     setData(result);
//   }, [posts, selectedTags]);

//   let tagsArray = [];
//   posts.forEach((post) => {
//     tagsArray = tagsArray.concat(post.frontmatter.tags.split(", "));
//   });

//   const uniqueTags = [...new Set(tagsArray)];

//   return (
//     <section className="bg-gray-800 pt-2 pb-2 px-8 ">
//       <div className="m-auto max-w-screen-2xl">
//         <h2 className="text-center text-white pt-16 pb-8">Featured Projects</h2>

//         <div className="flex flex-wrap items-center justify-center m-auto lg:col-start-1 lg:col-end-3">
//           {uniqueTags.map((tag) => (
//             <label className="bg-white px-3 py-0.5 mr-2 mt-4 lg:my-1 last:mr-0 rounded" key={tag}>
//               <input
//                 type="checkbox"
//                 value={tag}
//                 checked={selectedTags.includes(tag)}
//                 onChange={handleCheckboxChange}
//               />
//               {tag}
//             </label>
//           ))}
//         </div>

//         {/* Takes the first four posts and creates cards for them */}
//         {data.map((post, index) => (
//           <Project key={index} post={post} />
//         ))}
//       </div>
//     </section>
//   );
// }

export default function ProjectsAll({ posts }) {
  const [data, setData] = useState(posts);

  // Filter posts by tag
  const filterResult = (tagName) => {
    const result = posts.filter((curData) => {
      return curData.frontmatter.tags.includes(tagName);
    });
    setData(result);
  }

  let tagsArray = [];
  posts.forEach(post => {
    tagsArray = tagsArray.concat(post.frontmatter.tags.split(', '));
  });

  const uniqueTags = [...new Set(tagsArray)];

  return (
    <section className='bg-gray-800 pt-2 pb-2 px-8 '>
      <div className='m-auto max-w-screen-2xl'>

        <h2 className="text-center text-white pt-16 pb-8">Featured Projects</h2>


        <div className='flex flex-wrap items-center justify-center m-auto lg:col-start-1 lg:col-end-3'>
          {uniqueTags.map(tag => (
            <button className='bg-white px-3 py-0.5 mr-2 mt-4 lg:my-1 last:mr-0 rounded active:bg-violet-700' 
              onClick={() => filterResult(tag)} key={tag}>{tag}</button>
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
