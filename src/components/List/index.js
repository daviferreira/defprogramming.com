import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.css';

const Item = ({ children }) => <li className={styles.item}>{children}</li>;

Item.propTypes = {
  children: PropTypes.node
};

const List = ({ children, title }) => (
  <div className={styles.root}>
    <h2 className={styles.title}>{title}</h2>
    <ul className={styles.list}>{children}</ul>
  </div>
);

List.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

List.Item = Item;

export default List;
