import React from 'react';

import Layout from '../components/Layout';
import QuotesList from '../components/QuotesList';
import SEO from '../components/SEO';

const IndexPage = () => (
  <Layout>
    <SEO title="Quotes about coding" />
    <QuotesList />
  </Layout>
);

export default IndexPage;
