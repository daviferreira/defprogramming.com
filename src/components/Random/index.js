import sample from 'lodash.sample';
import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import QuotesList from '../QuotesList/List';

const Random = () => {
  const {
    allQuotesJson: { edges }
  } = useStaticQuery(
    graphql`
      query quotesIdsQuery {
        allQuotesJson {
          totalCount
          edges {
            node {
              uuid
            }
          }
        }
      }
    `
  );

  const quotes = edges.map(({ node }) => node.uuid);
  const randomQuoteId = sample(quotes);

  const [pageContext, setPageContext] = useState();

  useEffect(() => {
    fetch(`/page-data/q/${randomQuoteId}/page-data.json`)
      .then(result => result.json())
      .then(({ result: { pageContext } }) => {
        setPageContext(pageContext);
      });
  }, []);

  return pageContext ? (
    <QuotesList
      colorIndex={pageContext.index}
      pageContext={pageContext}
      quotes={pageContext.quotes}
      totalCount={pageContext.quotes.length}
      type="quote"
    />
  ) : null;
};

export default Random;
