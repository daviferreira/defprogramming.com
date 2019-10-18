import classnames from 'classnames';
import Clipboard from 'clipboard';
import he from 'he';
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as FacebookIcon } from './facebook.svg';
import { ReactComponent as LinkedInIcon } from './linked-in.svg';
import { ReactComponent as TwitterIcon } from './twitter.svg';
import { ReactComponent as UrlIcon } from './url.svg';

import styles from './styles.module.css';

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

  let decodedText = text;

  try {
    decodedText = he.decode(text);
  } catch (err) {
    // noop
  }

  return (
    <div className={styles.root}>
      <a
        className={styles.button}
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        rel="noopener noreferrer"
        target="_blank"
        title="Share on facebook"
      >
        <FacebookIcon />
      </a>
      <a
        className={styles.button}
        href={`https://twitter.com/share?text=${decodedText}&url=${url}&hashtags=dev`}
        rel="noopener noreferrer"
        target="_blank"
        title="Share on twitter"
      >
        <TwitterIcon />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
        className={classnames(styles.button, styles.linkedIn)}
        rel="noopener noreferrer"
        target="_blank"
        title="Share on linkedin"
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
