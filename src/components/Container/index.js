import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.css';

const Container = ({ children, title }) => (
  <div className={styles.root}>
    <h1 className={styles.title}>{title}</h1>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

export default Container;
