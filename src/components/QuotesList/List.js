import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { InView } from 'react-intersection-observer';

import Breadcrumb from '../Breadcrumb';
import Menu from '../Menu';
import Quote from './Quote';
import ShareBar from '../ShareBar';

import { getColor, getMostVisible, hexToRgb } from './utils';

import { ReactComponent as AuthorsIcon } from '../../images/authors.svg';
import { ReactComponent as TagsIcon } from '../../images/tags.svg';

import styles from './styles.module.css';

const iconProps = {
  className: styles.icon,
  fill: '#252525',
  height: 14,
  width: 14,
};

const List = ({
  colorIndex,
  onLoadMore,
  page,
  pageContext,
  quotes,
  tag,
  totalCount,
  type,
}) => {
  const [mostVisible, setMostVisible] = useState({
    color: getColor(colorIndex || 0),
    index: 0,
    percentage: 100,
    visibility: 'full',
  });

  useEffect(() => {
    const color = getColor(colorIndex || 0);

    setMostVisible({
      ...mostVisible,
      color,
    });

    // avoid flickering
    document.body.style.backgroundColor = color;
  }, [colorIndex]); // eslint-disable-line

  const node = useRef();

  const handler = () => {
    if (node && node.current) {
      const data = getMostVisible(node.current.children);
      const color = getColor(colorIndex || data.index);

      setMostVisible({
        color,
        ...data,
      });

      // avoid flickering
      document.body.style.backgroundColor = color;
    }
  };

  useEffect(() => {
    handler();

    window.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []); // eslint-disable-line

  const nextIndex = mostVisible.index + 1;
  const previousIndex = mostVisible.index - 1;

  const currentQuote = quotes[mostVisible.index];

  return (
    <>
      <Menu color={mostVisible.color} />
      <ShareBar
        text={currentQuote ? currentQuote.body : undefined}
        url={
          currentQuote
            ? `https://www.defprogramming.com/q/${currentQuote.uuid}/`
            : undefined
        }
      />
      {totalCount > 1 && (
        <div className={styles.count}>
          {mostVisible.index + 1}/{totalCount}
        </div>
      )}
      {type && (
        <Breadcrumb
          clear={type !== 'quote'}
          title={
            type === 'tag' ? (
              <span className={styles.breadcrumbLabel}>
                <TagsIcon {...iconProps} /> {pageContext.name}
              </span>
            ) : type === 'author' ? (
              <span className={styles.breadcrumbLabel}>
                <AuthorsIcon {...iconProps} /> {pageContext.name}
              </span>
            ) : (
              'Back to quotes'
            )
          }
          to="/"
        />
      )}
      <div className={styles.root} ref={node}>
        {quotes.map((quote, index) => {
          const isMostVisible = index === mostVisible.index;
          const isNext = index === nextIndex;
          const isPrevious = index === previousIndex;

          if (!isMostVisible && !isNext && !isPrevious) {
            return (
              <div
                className={styles.quote}
                data-index={index}
                key={quote.uuid}
              />
            );
          }

          const backgroundColor = isMostVisible
            ? mostVisible.color
            : getColor(index);

          let opacity;
          if (isNext || isPrevious) {
            opacity = (100 - mostVisible.percentage) / 100;
          } else if (isMostVisible) {
            opacity = mostVisible.percentage / 100;
          }

          let overlayStyle;
          if (isMostVisible || isNext || isPrevious) {
            const backgroundColor = isMostVisible
              ? mostVisible.visibility === 'top'
                ? getColor(index - 1)
                : getColor(index + 1)
              : isNext
              ? getColor(index - 1)
              : getColor(index + 1);

            const { r, g, b } = hexToRgb(backgroundColor);
            const overlayOpacity = isMostVisible
              ? (100 - mostVisible.percentage) / 100
              : mostVisible.percentage > 0
              ? mostVisible.percentage / 100
              : 0;

            overlayStyle = {
              boxShadow: `inset 0 0 0 100vh rgba(${r}, ${g}, ${b}, ${overlayOpacity})`,
            };
          }

          return (
            <div
              className={styles.quote}
              data-index={index}
              key={quote.uuid}
              style={{
                backgroundColor,
                ...overlayStyle,
              }}
            >
              <div className={styles.content}>
                <Quote
                  {...quote}
                  hideAuthors={type === 'author'}
                  opacity={opacity}
                  tag={tag}
                />
              </div>
            </div>
          );
        })}
        {!!onLoadMore && !!page && (
          <InView
            data-index={quotes.length}
            onChange={onLoadMore}
            rootMargin="600px"
          >
            <div
              className={styles.quote}
              style={{
                backgroundColor: getColor(quotes.length),
              }}
            >
              <Quote.Placeholder />
            </div>
          </InView>
        )}
      </div>
    </>
  );
};

List.propTypes = {
  colorIndex: PropTypes.number,
  onLoadMore: PropTypes.func,
  page: PropTypes.number,
  pageContext: PropTypes.object,
  quotes: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  tag: PropTypes.string,
  type: PropTypes.oneOf(['author', 'quote', 'tag']),
};

List.defaultProps = {
  totalCount: 0,
};

export default List;
