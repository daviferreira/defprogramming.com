import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { InView } from 'react-intersection-observer';

import Menu from '../Menu';
import Quote from './Quote';
import ShareBar from '../ShareBar';

import { getColor, getMostVisible, hexToRgb } from './utils';

import styles from './styles.module.css';

const QuotesList = () => {
  const {
    allQuotesJson: { edges, totalCount }
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

  const handleLoadNext = async inView => {
    if (!inView) {
      return;
    }

    try {
      const result = await fetch(`/pages/${page}.json`);

      const { items, nextPage } = await result.json();

      setPage(nextPage);

      setQuotes(quotes.concat(items));

      if (
        window.pageYOffset + window.innerHeight >=
        document.body.clientHeight
      ) {
        document
          .querySelector(`[data-index="${quotes.length}"]`)
          .scrollIntoView();
      }
    } catch (err) {
      throw err;
    }
  };

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
                <Quote {...quote} opacity={opacity} />
              </div>
            </div>
          );
        })}
        {!!page && (
          <InView
            data-index={quotes.length}
            onChange={handleLoadNext}
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

export default QuotesList;
