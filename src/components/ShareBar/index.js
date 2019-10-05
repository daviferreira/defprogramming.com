import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import FacebookIcon from './facebook.svg';
import LinkedInIcon from './linked-in.svg';
import TwitterIcon from './twitter.svg';

import styles from './styles.module.css';

const ShareBar = ({ text, url = 'https://www.defprogramming.com' }) => (
  <div className={styles.root}>
    <a
      className={styles.button}
      href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <FacebookIcon />
    </a>
    <a
      className={styles.button}
      href={`https://twitter.com/share?text=${text}&url=${url}&hashtags=dev`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <TwitterIcon />
    </a>
    <a
      href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
      className={classnames(styles.button, styles.linkedIn)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <LinkedInIcon />
    </a>
  </div>
);

ShareBar.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string
};

export default ShareBar;
