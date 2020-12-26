import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import QuotesList from '../components/QuotesList/List';
import SEO from '../components/SEO';

const TagPage = ({ pageContext }) => (
  <Layout>
    <SEO title={`Quote by ${pageContext.quotes[0].authors.join(',')}`} />
    <QuotesList
      colorIndex={pageContext.index}
      pageContext={pageContext}
      quotes={pageContext.quotes}
      type="quote"
    />
  </Layout>
);

TagPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

export default TagPage;
