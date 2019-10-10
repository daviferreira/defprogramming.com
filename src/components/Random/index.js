import sample from 'lodash.sample';
import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Container from '../Container';
import List from '../List';

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

  return <div style={{ color: '#fff' }}>{sample(quotes)}</div>;
};

export default Random;
