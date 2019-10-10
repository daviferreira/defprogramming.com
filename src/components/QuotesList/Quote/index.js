import classnames from 'classnames';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import slugify from '@sindresorhus/slugify';

import styles from './styles.module.css';

const Quote = ({ authors, body, opacity, tags }) => (
  <div
    className={classnames(styles.root, {
      [styles.largeText]: body.length > 230
    })}
    style={{ opacity }}
  >
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: body }} /* eslint-disable-line */
    />
    <div className={styles.meta}>
      <span className={styles.item}>
        {authors.map((author, index) => (
          <Fragment key={author}>
            <a href={`/quotes-by/${slugify(author)}/`}>{author}</a>
            {index < authors.length - 1 && <span>&bull;</span>}
          </Fragment>
        ))}
      </span>
      <span className={classnames(styles.item, styles.tags)}>
        [
        {tags.map((tag, index) => (
          <Fragment key={tag}>
            <a href={`/quotes-tagged-with/${slugify(tag)}/`}>{tag}</a>
            {index < tags.length - 1 && <span>&bull;</span>}
          </Fragment>
        ))}
        ]
      </span>
    </div>
  </div>
);

Quote.propTypes = {
  authors: PropTypes.array.isRequired,
  body: PropTypes.string.isRequired,
  opacity: PropTypes.number,
  tags: PropTypes.array.isRequired
};

export default Quote;
