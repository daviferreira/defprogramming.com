import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Quote from './Quote';
import ShareBar from '../ShareBar';

import { getColor, getMostVisible, hexToRgb } from './utils';

import styles from './styles.module.css';

const QuotesList = () => {
  const {
    allQuotesJson: { edges }
  } = useStaticQuery(
    graphql`
      query {
        allQuotesJson(
          limit: 22
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

  const quotes = edges.map(({ node }) => node);

  const [mostVisible, setMostVisible] = useState({
    color: getColor(0),
    index: 0,
    uuid: quotes[0].uuid,
    percentage: 100,
    visibility: 'full'
  });

  const node = useRef();

  const handler = () => {
    if (node && node.current) {
      const data = getMostVisible(node.current.children);
      const index = quotes.findIndex(quote => quote.uuid === data.uuid);
      const color = getColor(index);

      setMostVisible({
        index,
        color,
        ...data
      });

      // avoid flickering
      document.body.style.backgroundColor = color;
    }
  };

  // FIXME: unmount
  useEffect(() => {
    window.addEventListener('scroll', handler);
  }, []);

  const nextIndex = mostVisible.index + 1;
  const previousIndex = mostVisible.index - 1;

  return (
    <>
      <ShareBar />
      <div className={styles.root} ref={node}>
        {quotes.map((quote, index) => {
          const isMostVisible = index === mostVisible.index;
          const isNext = index === nextIndex;
          const isPrevious = index === previousIndex;

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
              data-uuid={quote.uuid}
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
      </div>
    </>
  );
};

export default QuotesList;
