import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import styles from './styles.module.css';

const Menu = ({ color }) => {
  const [checked, setChecked] = useState(false);
  const style = checked ? { backgroundColor: color } : undefined;
  const linkStyle = { color };

  return (
    <nav role="navigation" className={styles.root}>
      <div className={styles.toggler}>
        <input type="checkbox" onChange={() => setChecked(!checked)} />

        <span style={style} />
        <span style={style} />
        <span style={style} />

        <ul className={styles.menu}>
          <li>
            <Link className={styles.item} to="/" style={linkStyle}>
              Home
            </Link>
          </li>
          <li>
            <Link className={styles.item} to="/random/" style={linkStyle}>
              Random
            </Link>
          </li>
          <li>
            <Link className={styles.item} to="/authors/" style={linkStyle}>
              Authors
            </Link>
          </li>
          <li>
            <Link className={styles.item} to="/tags/" style={linkStyle}>
              Tags
            </Link>
          </li>
          <li className={styles.footer}>
            <div>
              curated by&nbsp;
              <a
                href="https://www.daviferreira.com"
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
  color: PropTypes.string
};

export default Menu;
