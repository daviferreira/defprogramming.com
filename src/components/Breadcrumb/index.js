import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import styles from './styles.module.css';

const Breadcrumb = ({ clear, title, to }) =>
  clear ? (
    <div
      className={classnames(styles.root, {
        [styles.hasClear]: clear,
      })}
    >
      {title}
      <div className={styles.clear} onClick={() => history && history.go(-1)}>
        &times;
      </div>
    </div>
  ) : (
    <Link className={styles.root} to={to}>
      {title}
    </Link>
  );

Breadcrumb.propTypes = {
  clear: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  to: PropTypes.string.isRequired,
};

export default Breadcrumb;
