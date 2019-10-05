import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Quote from './Quote';
import ShareBar from '../ShareBar';

import styles from './styles.module.css';

const COLORS = [
  '#29a3ee',
  '#d2415f',
  '#927461',
  '#88c18d',
  '#764092',
  '#fc3b2d',
  '#f0a9a5',
  '#101851',
  '#f6882f',
  '#252525'
];

const QuotesList = () => {
  const {
    allQuotesJson: { edges }
  } = useStaticQuery(
    graphql`
      query {
        allQuotesJson(
          limit: 10
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

  const quotes = edges.map(({ node }) => node);

  return (
    <>
      <ShareBar />
      <div className={styles.root}>
        {quotes.map((quote, index) => (
          <div
            className={styles.quote}
            key={quote.uuid}
            style={{
              backgroundColor: COLORS[index]
            }}
          >
            <Quote {...quote} />
          </div>
        ))}
      </div>
    </>
  );
};

export default QuotesList;
