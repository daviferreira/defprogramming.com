import React from 'react';

import Layout from '../components/Layout';
import Random from '../components/Random';
import SEO from '../components/SEO';

const TagsPage = () => (
  <Layout internal>
    <SEO title="Random quote" />
    <Random />
  </Layout>
);

export default TagsPage;
