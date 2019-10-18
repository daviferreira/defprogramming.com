import sample from 'lodash.sample';
import React, { useEffect, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import { ReactComponent as RefreshIcon } from './refresh.svg';

import QuotesList from '../QuotesList/List';
import Spinner from '../Spinner';

import styles from './styles.module.css';

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

  const [pageContext, setPageContext] = useState();
  const [isLoading, setLoading] = useState(true);

  const fetchRandomQuote = () => {
    setLoading(true);

    return fetch(`/page-data/q/${sample(quotes)}/page-data.json`)
      .then(result => result.json())
      .then(({ result: { pageContext } }) => {
        setPageContext(pageContext);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  return isLoading ? (
    <div className={styles.loader}>
      <Spinner />
    </div>
  ) : (
    <>
      <div className={styles.refresh} onClick={fetchRandomQuote}>
        <RefreshIcon />
      </div>
      <QuotesList
        colorIndex={pageContext.index}
        pageContext={pageContext}
        quotes={pageContext.quotes}
        totalCount={pageContext.quotes.length}
        type="quote"
      />
    </>
  );
};

export default Random;
