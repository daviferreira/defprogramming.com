import React from 'react';

import Layout from '../components/Layout';
import AuthorsList from '../components/AuthorsList';
import SEO from '../components/SEO';

const AuthorsPage = () => (
  <Layout internal>
    <SEO title="Authors list" />
    <AuthorsList />
  </Layout>
);

export default AuthorsPage;
