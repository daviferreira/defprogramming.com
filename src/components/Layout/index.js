import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../Menu';

import './styles.css';

const Layout = ({ children, internal }) => (
  <>
    {internal && <Menu />}
    <main style={internal ? { backgroundColor: '#101851' } : undefined}>
      {children}
    </main>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  internal: PropTypes.bool
};

export default Layout;
