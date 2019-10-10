import React from 'react';

import Layout from '../components/Layout';
import TagsList from '../components/TagsList';
import SEO from '../components/SEO';

const TagsPage = () => (
  <Layout internal>
    <SEO title="Tags list" />
    <TagsList />
  </Layout>
);

export default TagsPage;
