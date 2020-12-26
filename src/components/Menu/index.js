import classnames from 'classnames';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import styles from './styles.module.css';

const Menu = ({ color, dark }) => {
  const [checked, setChecked] = useState(false);
  const style = checked ? { backgroundColor: color } : undefined;
  const linkStyle = { color };

  return (
    <nav
      role="navigation"
      className={classnames(styles.root, {
        [styles.dark]: dark,
      })}
    >
      <div className={styles.toggler}>
        <input
          aria-hidden="true"
          type="checkbox"
          onChange={() => setChecked(!checked)}
        />

        <span style={style} />
        <span style={style} />
        <span style={style} />

        <ul className={styles.menu}>
          <li>
            <Link
              className={styles.item}
              to="/"
              style={linkStyle}
              tutle="Home page"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={styles.item}
              to="/random/"
              style={linkStyle}
              title="Random quote"
            >
              Random
            </Link>
          </li>
          <li>
            <Link
              className={styles.item}
              to="/authors/"
              style={linkStyle}
              title="Authors list"
            >
              Authors
            </Link>
          </li>
          <li>
            <Link
              className={styles.item}
              to="/tags/"
              style={linkStyle}
              title="Tags list"
            >
              Tags
            </Link>
          </li>
          <li className={styles.footer}>
            <div>
              curated by&nbsp;
              <a
                href="https://www.twitter.com/davitferreira"
                rel="noopener noreferrer"
                target="_blank"
              >
                Davi Ferreira
              </a>
            </div>
            <div>
              <a
                href="https://github.com/daviferreira/defprogramming.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                source code
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

Menu.propTypes = {
  color: PropTypes.string,
  dark: PropTypes.bool,
};

export default Menu;
