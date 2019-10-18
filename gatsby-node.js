const path = require(`path`);
const fs = require('fs');

function createQuotesPagination(quotes) {
  const perPage = 20;
  const totalPages = Math.ceil(quotes.length / perPage);

  for (var currentPage = 1; currentPage <= totalPages; currentPage += 1) {
    const pathSuffix = currentPage > 1 ? currentPage : '';

    const start = perPage * (currentPage - 1);
    const end = start + perPage;
    const pageQuotes = quotes.slice(start, end);

    const pageData = {
      path: `/${pathSuffix}`,
      context: {
        pageQuotes,
        currentPage,
        totalPages
      }
    };

    createJSON(pageData);
  }

  // eslint-disable-next-line
  console.log(`\nCreated ${totalPages} pages of paginated content.`);
}

function createAuthorPages(quotes, { graphql, createPage }) {
  const component = path.resolve(`src/templates/author.js`);

  return graphql(`
    query authorsListQuery {
      allAuthorsJson {
        totalCount
        edges {
          node {
            uuid
            name
            slug
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const authors = result.data.allAuthorsJson.edges.map(({ node }) => node);

    authors.forEach(({ name, slug, uuid }) => {
      const pageData = {
        path: `/quotes-by/${slug}/`,
        component,
        context: {
          quotes: quotes.filter(quote => quote.authors_uuid.includes(uuid)),
          name,
          slug
        }
      };

      createPage(pageData);
      // eslint-disable-next-line
      console.log(`\nCreated ${slug} author page.`);
    });
  });
}

function createTagPages(quotes, { graphql, createPage }) {
  const component = path.resolve(`src/templates/tag.js`);

  return graphql(`
    query tagsListQuery {
      allTagsJson {
        totalCount
        edges {
          node {
            uuid
            name
            slug
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const tags = result.data.allTagsJson.edges.map(({ node }) => node);

    tags.forEach(({ name, slug, uuid }) => {
      const pageData = {
        path: `/quotes-tagged-with/${slug}/`,
        component,
        context: {
          quotes: quotes.filter(quote => quote.tags_uuid.includes(uuid)),
          name,
          slug
        }
      };

      createPage(pageData);
      // eslint-disable-next-line
      console.log(`\nCreated ${slug} tag page.`);
    });
  });
}

function createQuotePages(quotes, { createPage }) {
  const component = path.resolve(`src/templates/quote.js`);

  let index = 0;
  quotes.forEach(quote => {
    const { body, uuid } = quote;

    const pageData = {
      path: `/q/${uuid}/`,
      component,
      context: {
        quotes: [quote],
        body,
        index
      }
    };

    createPage(pageData);

    // eslint-disable-next-line
    console.log(`\nCreated ${uuid} quote page.`);
    index++;
  });
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return graphql(`
    query quotesListQuery {
      allQuotesJson(sort: { fields: [publish_date], order: [DESC] }) {
        totalCount
        edges {
          node {
            uuid
            body
            authors
            authors_uuid
            tags
            tags_uuid
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    const quotes = result.data.allQuotesJson.edges.map(({ node }) => node);

    createQuotesPagination(quotes);

    return createAuthorPages(quotes, { graphql, createPage })
      .then(() => createTagPages(quotes, { graphql, createPage }))
      .then(() => createQuotePages(quotes, { createPage }));
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
      // eslint-disable-next-line
      return console.log(err);
    }
  });
}
