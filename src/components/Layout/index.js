import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Menu from '../Menu';

import './styles.css';

const Layout = ({ children, internal }) => {
  useEffect(() => {
    if (internal) {
      document.body.style.backgroundColor = '#101851';
    }
  }, [internal]);

  return (
    <>
      {internal && <Menu />}
      <main>{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  internal: PropTypes.bool
};

export default Layout;
