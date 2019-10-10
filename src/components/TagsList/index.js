import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Container from '../Container';
import List from '../List';

const TagsList = () => {
  const {
    allTagsJson: { edges }
  } = useStaticQuery(
    graphql`
      query tagsListQuery {
        allTagsJson(sort: { fields: [name], order: [ASC] }) {
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

  const tags = edges.map(({ node }) => node);
  console.log(tags);

  return (
    <Container title="Quotes by tag">
      <List>
        {tags.map(({ name, slug }) => (
          <List.Item key={slug}>
            <Link to={`/quotes-tagged-with/${slug}/`}>{name}</Link>
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default TagsList;
