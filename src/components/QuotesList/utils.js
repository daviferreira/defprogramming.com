import { COLORS } from './constants';

export const getMostVisible = elements => {
  const viewportHeight = window.innerHeight;

  let mostVisible;
  let max = 0;

  elements.forEach(element => {
    const visiblePx = getVisibleHeightPx(element, viewportHeight);

    if (visiblePx > max) {
      max = visiblePx;
      mostVisible = element.getAttribute('data-uuid');
    }
  });
  return {
    id: mostVisible,
    percentage: Math.round((max / viewportHeight) * 100)
  };
};

const getVisibleHeightPx = (element, viewportHeight) => {
  const rect = element.getBoundingClientRect();
  const height = rect.bottom - rect.top;
  const visible = {
    top: rect.top >= 0 && rect.top < viewportHeight,
    bottom: rect.bottom > 0 && rect.bottom < viewportHeight
  };

  let visiblePx = 0;

  if (visible.top && visible.bottom) {
    // Whole element is visible
    visiblePx = height;
  } else if (visible.top) {
    visiblePx = viewportHeight - rect.top;
  } else if (visible.bottom) {
    visiblePx = rect.bottom;
  } else if (height > viewportHeight && rect.top < 0) {
    const absTop = Math.abs(rect.top);

    if (absTop < height) {
      // Part of the element is visible
      visiblePx = height - absTop;
    }
  }

  return visiblePx;
};

export const getColors = index => {
  for (let i = 4; i > 1; i--) {
    if (!(index % i)) {
      const color = COLORS[i - 1];
      if (color) {
        return color;
      }
    }
  }

  return COLORS[0];
};
