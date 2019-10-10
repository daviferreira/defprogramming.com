import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.css';

const Item = ({ children }) => <li className={styles.item}>{children}</li>;

Item.propTypes = {
  children: PropTypes.node
};

const List = ({ children }) => <ul className={styles.root}>{children}</ul>;

List.propTypes = {
  children: PropTypes.node
};

List.Item = Item;

export default List;
