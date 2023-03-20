import React from 'react'

export default function FilterCheckbox({ tag, state, onChange }) {

  // Change state of tag when checkbox is clicked
  function handleCheckboxChange(event) {
    if (event.target.checked) {
      state[tag]=true;
    } else {
      state[tag]=false;
    }

    // Filter posts by tagfor use in onChange
    const selectedTags = Object.keys(state).filter((key) => state[key]);
    onChange(selectedTags);
  }
  
  return (
    <div>
      <input type="checkbox"  id={'check-' + tag} name={'check-' + tag} className="peer" onChange={handleCheckboxChange} hidden />
      <label  htmlFor={'check-' + tag} className='cursor-pointer select-none bg-white peer-checked:bg-red-300 px-3 py-1 mr-2 mt-4 lg:my-1 last:mr-0 rounded'>{tag}</label> 
    </div>
  )
}
