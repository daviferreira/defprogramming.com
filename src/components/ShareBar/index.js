import classnames from 'classnames';
import Clipboard from 'clipboard';
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import FacebookIcon from './facebook.svg';
import LinkedInIcon from './linked-in.svg';
import TwitterIcon from './twitter.svg';
import UrlIcon from './url.svg';

import styles from './styles.module.css';

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

const ShareBar = ({ text, url = 'https://www.defprogramming.com' }) => {
  const [showCopied, setShowCopied] = useState(false);
  const urlButton = useRef();

  useEffect(() => {
    const clipboard = new Clipboard(urlButton.current);

    clipboard.on('success', () => {
      setShowCopied(true);

      setTimeout(() => {
        setShowCopied(false);
      }, 1000);
    });

    return () => {
      clipboard.destroy();
    };
  }, [url]);

  return (
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
        href={`https://twitter.com/share?text=${decodeHtml(
          text
        )}&url=${url}&hashtags=dev`}
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
      <div
        className={classnames(styles.button, styles.url)}
        data-clipboard-text={url}
        ref={urlButton}
      >
        {showCopied && <div className={styles.copied}>Url copied!</div>}
        <UrlIcon />
      </div>
    </div>
  );
};

ShareBar.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string
};

export default ShareBar;
