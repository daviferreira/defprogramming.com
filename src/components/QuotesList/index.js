import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { useInView } from 'react-intersection-observer';

import Menu from '../Menu';
import Quote from './Quote';
import ShareBar from '../ShareBar';

import { getColor, getMostVisible, hexToRgb } from './utils';

import styles from './styles.module.css';

const QuotesList = () => {
  const {
    allQuotesJson: { edges }
  } = useStaticQuery(
    graphql`
      query quotesListQuery {
        allQuotesJson(
          limit: 20
          sort: { fields: [publish_date], order: [DESC] }
        ) {
          totalCount
          edges {
            node {
              uuid
              body
              authors
              tags
            }
          }
        }
      }
    `
  );

  const [quotes, setQuotes] = useState(edges.map(({ node }) => node));
  const [page, setPage] = useState(2);
  const [isLoading, setLoading] = useState(false);

  const [ref, inView] = useInView({
    rootMargin: '1000px'
  });

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

  if (page && inView && !isLoading) {
    setLoading(true);

    return fetch(`/pages/${page}.json`)
      .then(result => result.json())
      .then(({ items, nextPage }) => {
        setPage(nextPage);

        return setQuotes(quotes.concat(items));
      })
      .catch(err => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Menu color={mostVisible.color} />
      <ShareBar />
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
                <Quote {...quote} opacity={opacity} />
              </div>
            </div>
          );
        })}
        {(isLoading || page) && (
          <div
            className={styles.quote}
            data-index={quotes.length}
            ref={ref}
            style={{
              backgroundColor: getColor(quotes.length)
            }}
          >
            <Quote.Placeholder />
          </div>
        )}
      </div>
    </>
  );
};

export default QuotesList;
