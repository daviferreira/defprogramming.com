import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import slugify from '@sindresorhus/slugify';

import styles from './styles.module.css';

const Quote = ({ authors, body, tags }) => (
  <div
    className={classnames(styles.root, {
      [styles.largeText]: body.length > 260
    })}
  >
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: body }} /* eslint-disable-line */
    />
    <div className={styles.meta}>
      <span className={styles.item}>
        _
        {authors.map(author => (
          <a href={`/quotes-by/${slugify(author)}/`} key={author}>
            {author}
          </a>
        ))}
      </span>
      <span className={classnames(styles.item, styles.tags)}>
        [
        {tags.map(tag => (
          <a href={`/quotes-tagged-with/${slugify(tag)}/`} key={tag}>
            {tag}
          </a>
        ))}
        ]
      </span>
    </div>
  </div>
);

Quote.propTypes = {
  authors: PropTypes.array.isRequired,
  body: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired
};

export default Quote;
