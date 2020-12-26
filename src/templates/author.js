import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/Layout';
import QuotesList from '../components/QuotesList/List';
import SEO from '../components/SEO';

const AuthorPage = ({ pageContext }) => (
  <Layout>
    <SEO title={`Quotes by ${pageContext.name}`} />
    <QuotesList
      pageContext={pageContext}
      quotes={pageContext.quotes}
      totalCount={pageContext.quotes.length}
      type="author"
    />
  </Layout>
);

AuthorPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
};

export default AuthorPage;
