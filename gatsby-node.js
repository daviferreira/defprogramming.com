const path = require(`path`);
const fs = require('fs');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  /* In production you should fetch your quotes with GraphQL like this: */
  return graphql(`
    query quotesListQuery {
      allQuotesJson(sort: { fields: [publish_date], order: [DESC] }) {
        totalCount
        edges {
          node {
            uuid
            body
            authors
            tags
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const quotes = result.data.allQuotesJson.edges.map(({ node }) => node);

    const component = path.resolve(`src/templates/paginated-page.js`);

    /* Iterate needed pages and create them. */
    const perPage = 20;
    const totalPages = Math.ceil(quotes.length / perPage);

    for (var currentPage = 1; currentPage <= totalPages; currentPage += 1) {
      const pathSuffix =
        currentPage > 1
          ? currentPage
          : ''; /* To create paths "/", "/2", "/3", ... */

      /* Collect quotes needed for this page. */
      const start = perPage * (currentPage - 1);
      const end = start + perPage;
      const pageQuotes = quotes.slice(start, end);

      /* Combine all data needed to construct this page. */
      const pageData = {
        path: `/${pathSuffix}`,
        component,
        context: {
          /* If you need to pass additional data, you can pass it inside this context object. */
          pageQuotes,
          currentPage,
          totalPages
        }
      };

      /* Create normal pages (for pagination) and corresponding JSON (for infinite scroll). */
      createJSON(pageData);
      // createPage(pageData);
    }

    console.log(`\nCreated ${totalPages} pages of paginated content.`);
  });
};

function createJSON({
  context: { pageQuotes, currentPage, totalPages },
  path
}) {
  const pathSuffix = path.substring(1);
  const dir = 'public/pages/';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = `${dir}${pathSuffix}.json`;
  const dataToSave = JSON.stringify({
    nextPage: currentPage < totalPages && currentPage + 1,
    items: pageQuotes
  });

  fs.writeFile(filePath, dataToSave, function(err) {
    if (err) {
      return console.log(err);
    }
  });
}
