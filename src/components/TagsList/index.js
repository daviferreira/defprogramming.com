import groupBy from 'lodash.groupby';
import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Breadcrumb from '../Breadcrumb';
import Container from '../Container';
import List from '../List';

const TagsList = () => {
  const {
    allTagsJson: { edges },
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

  const groups = groupBy(
    edges.map(({ node }) => node),
    (item) => item.name[0].toUpperCase()
  );

  return (
    <>
      <Breadcrumb title="Back to quotes" to="/" />
      <Container title="Quotes by tag">
        {Object.keys(groups).map((letter) => (
          <List key={letter} title={letter}>
            {groups[letter].map(({ name, slug }) => (
              <List.Item key={slug}>
                <Link to={`/quotes-tagged-with/${slug}/`}>{name}</Link>
              </List.Item>
            ))}
          </List>
        ))}
      </Container>
    </>
  );
};

export default TagsList;
