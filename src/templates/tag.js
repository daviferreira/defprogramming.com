import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import QuotesList from '../components/QuotesList/List';
import SEO from '../components/SEO';

const TagPage = ({ pageContext }) => (
  <Layout>
    <SEO title={`Quotes tagged with ${pageContext.name}`} />
    <QuotesList
      pageContext={pageContext}
      quotes={pageContext.quotes}
      tag={pageContext.name}
      totalCount={pageContext.quotes.length}
      type="tag"
    />
  </Layout>
);

TagPage.propTypes = {
  pageContext: PropTypes.object.isRequired
};

export default TagPage;
