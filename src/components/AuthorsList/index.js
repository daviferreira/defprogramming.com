import groupBy from 'lodash.groupby';
import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Container from '../Container';
import List from '../List';

const AuthorsList = () => {
  const {
    allAuthorsJson: { edges }
  } = useStaticQuery(
    graphql`
      query authorsListQuery {
        allAuthorsJson(sort: { fields: [name], order: [ASC] }) {
          totalCount
          edges {
            node {
              name
              slug
            }
          }
        }
      }
    `
  );

  const groups = groupBy(edges.map(({ node }) => node), item =>
    item.name[0].toUpperCase()
  );

  return (
    <Container title="Quotes by author">
      {Object.keys(groups).map(letter => (
        <List key={letter} title={letter}>
          {groups[letter].map(({ name, slug }) => (
            <List.Item key={slug}>
              <Link to={`/quotes-by/${slug}/`}>{name}</Link>
            </List.Item>
          ))}
        </List>
      ))}
    </Container>
  );
};

export default AuthorsList;
