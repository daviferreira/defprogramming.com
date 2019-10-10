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

  const authors = edges.map(({ node }) => node);
  console.log(authors);

  return (
    <Container title="Quotes by author">
      <List>
        {authors.map(({ name, slug }) => (
          <List.Item key={slug}>
            <Link to={`/quotes-by/${slug}/`}>{name}</Link>
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default AuthorsList;
