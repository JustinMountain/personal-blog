// Ascending Sort
export const sortDescendingyDate = (a, b) => {
  return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
}

// Descending Sort 
export const sortAscendingByDate = (a, b) => {
  return new Date(a.frontmatter.date) - new Date(b.frontmatter.date)
}