export default () => {
  /* eslint-disable-next-line no-restricted-globals */
  self.addEventListener("message", (e) => {
    if (!e) return;

    let pages = e.data.pages;
    const filter = e.data.filter;
    const searchTerm = e.data.searchTerm;
    const loadingOffset = e.data.loadingOffset;

    if (filter === "all")
      pages = pages
        .filter((page) =>
          page.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, loadingOffset);
    // filter and only keep pages that have schemas
    else if (filter === "with-schemas")
      pages = pages
        .filter(
          (page) =>
            JSON.stringify(page).includes("application/ld+json") &&
            page.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, loadingOffset);
    // filter and only keep pages that are missing a schema
    else if (filter === "missing-schemas")
      pages = pages
        .filter(
          (page) =>
            !JSON.stringify(page).includes("application/ld+json") &&
            page.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, loadingOffset);
    else if (filter === "warnings")
      pages = pages
        .filter((page) => page.testResult === false)
        .slice(0, loadingOffset);

    postMessage(pages);
  });
};
