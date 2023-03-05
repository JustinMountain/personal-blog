// Ascending Sort
export const sortDescendingByDate = (a, b) => {
  return new Date(b.frontmatter.published) - new Date(a.frontmatter.published)
};

// Descending Sort 
export const sortAscendingByDate = (a, b) => {
  return new Date(a.frontmatter.published) - new Date(b.frontmatter.published)
};