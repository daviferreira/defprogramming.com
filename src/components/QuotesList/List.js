import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { InView } from 'react-intersection-observer';

import Menu from '../Menu';
import Quote from './Quote';
import ShareBar from '../ShareBar';

import { getColor, getMostVisible, hexToRgb } from './utils';

import styles from './styles.module.css';

const List = ({ onLoadMore, page, pageContext, quotes, totalCount, type }) => {
  const [mostVisible, setMostVisible] = useState({
    color: getColor(0),
    index: 0,
    percentage: 100,
    visibility: 'full'
  });

  const node = useRef();

  const handler = () => {
    if (node && node.current) {
      const data = getMostVisible(node.current.children);
      const color = getColor(data.index);

      setMostVisible({
        color,
        ...data
      });

      // avoid flickering
      document.body.style.backgroundColor = color;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

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
      <div className={styles.count}>
        {mostVisible.index + 1}/{totalCount}
      </div>
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
              boxShadow: `inset 0 0 0 100vh rgba(${r}, ${g}, ${b}, ${overlayOpacity})`
            };
          }

          return (
            <div
              className={styles.quote}
              data-index={index}
              key={quote.uuid}
              style={{
                backgroundColor,
                ...overlayStyle
              }}
            >
              <div className={styles.content}>
                <Quote
                  {...quote}
                  hideAuthors={type === 'author'}
                  hideTags={type === 'tag'}
                  opacity={opacity}
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
                backgroundColor: getColor(quotes.length)
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
  onLoadMore: PropTypes.func,
  page: PropTypes.number,
  pageContext: PropTypes.object,
  quotes: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  type: PropTypes.oneOf(['author', 'tag'])
};

export default List;
