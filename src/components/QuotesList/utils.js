import { COLORS } from './constants';

export const getMostVisible = elements => {
  const viewportHeight = window.innerHeight;

  let mostVisible;
  let max = 0;
  let visibility = 'full';

  [].forEach.call(elements, element => {
    const { visiblePx, position } = getVisibleHeightPx(element, viewportHeight);

    if (visiblePx > max) {
      max = visiblePx;
      mostVisible = element.getAttribute('data-uuid');
      visibility = position;
    }
  });
  return {
    uuid: mostVisible,
    percentage: Math.round((max / viewportHeight) * 100),
    visibility
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
  let position = 'full';

  if (visible.top && visible.bottom) {
    // Whole element is visible
    visiblePx = height;
  } else if (visible.top) {
    visiblePx = viewportHeight - rect.top;
    position = 'top';
  } else if (visible.bottom) {
    visiblePx = rect.bottom;
    position = 'bottom';
  } else if (height > viewportHeight && rect.top < 0) {
    const absTop = Math.abs(rect.top);

    if (absTop < height) {
      // Part of the element is visible
      visiblePx = height - absTop;
    }
  }

  return { visiblePx, position };
};

export const getColor = index => {
  const num = index > COLORS.length ? index % COLORS.length : index;
  for (let i = COLORS.length; i > 0; i--) {
    if (!(num % i)) {
      const color = COLORS[i - 1];
      if (color) {
        return color;
      }
    }
  }

  return COLORS[0];
};

export const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : {};
};
