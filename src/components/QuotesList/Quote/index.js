import classnames from 'classnames';
import { Link } from 'gatsby';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import slugify from '@sindresorhus/slugify';

import Spinner from '../../Spinner';

import AuthorsIcon from '../../../images/authors.svg';
import TagsIcon from '../../../images/tags.svg';

import styles from './styles.module.css';

const iconProps = {
  className: styles.icon,
  fill: '#fff',
  height: 14,
  width: 14
};

const Placeholder = () => (
  <div className={classnames(styles.root, styles.loader)}>
    <Spinner />
  </div>
);

const Quote = ({ authors, body, hideAuthors, hideTags, opacity, tags }) => (
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
      {!hideAuthors && (
        <span className={styles.item}>
          <AuthorsIcon {...iconProps} alt="Authors" />
          {authors.map((author, index) => (
            <Fragment key={author}>
              <Link to={`/quotes-by/${slugify(author)}/`}>{author}</Link>
              {index < authors.length - 1 && <span>&bull;</span>}
            </Fragment>
          ))}
        </span>
      )}
      {!hideTags && (
        <span className={classnames(styles.item, styles.tags)}>
          <TagsIcon {...iconProps} alt="Tags" />
          {tags.map((tag, index) => (
            <Fragment key={tag}>
              <Link to={`/quotes-tagged-with/${slugify(tag)}/`}>{tag}</Link>
              {index < tags.length - 1 && <span>&bull;</span>}
            </Fragment>
          ))}
        </span>
      )}
    </div>
  </div>
);

Quote.Placeholder = Placeholder;

Quote.propTypes = {
  authors: PropTypes.array.isRequired,
  body: PropTypes.string.isRequired,
  hideAuthors: PropTypes.bool,
  hideTags: PropTypes.bool,
  opacity: PropTypes.number,
  tags: PropTypes.array.isRequired
};

export default Quote;
