import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import List from './List';

const QuotesList = () => {
  const {
    allQuotesJson: { edges, totalCount }
  } = useStaticQuery(
    graphql`
      query quotesListQuery {
        allQuotesJson(
          limit: 20
          sort: { fields: [publish_date], order: [DESC] }
        ) {
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
    `
  );

  const [quotes, setQuotes] = useState(edges.map(({ node }) => node));
  const [page, setPage] = useState(2);

  const handleLoadNext = async inView => {
    if (!inView) {
      return;
    }

    const result = await fetch(`/pages/${page}.json`);

    const { items, nextPage } = await result.json();

    setPage(nextPage);

    setQuotes(quotes.concat(items));

    if (window.pageYOffset + window.innerHeight >= document.body.clientHeight) {
      const el = document.querySelector(`[data-index="${quotes.length}"]`);

      if (el) {
        el.scrollIntoView();
      }
    }
  };

  return (
    <List
      onLoadMore={handleLoadNext}
      page={page || undefined}
      quotes={quotes}
      totalCount={totalCount}
    />
  );
};

export default QuotesList;
