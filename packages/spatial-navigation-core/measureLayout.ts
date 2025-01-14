const ELEMENT_NODE = 1;

const getRect = (node: HTMLElement) => {
  let offsetParent = node.offsetParent as HTMLElement;
  const height = node.offsetHeight;
  const width = node.offsetWidth;
  let left = node.offsetLeft;
  let top = node.offsetTop;

  while (offsetParent && offsetParent.nodeType === ELEMENT_NODE) {
    left += offsetParent.offsetLeft - offsetParent.scrollLeft;
    top += offsetParent.offsetTop - offsetParent.scrollTop;
    offsetParent = offsetParent.offsetParent as HTMLElement;
  }

  return {
    height,
    left,
    top,
    width,
  };
};

const measureLayout = (node: HTMLElement) => {
  const relativeNode = node && node.parentElement;

  if (node && relativeNode) {
    const relativeRect = getRect(relativeNode);
    const { height, left, top, width } = getRect(node);
    const x = left - relativeRect.left;
    const y = top - relativeRect.top;

    return {
      x,
      y,
      width,
      height,
      left,
      top,
      get right() {
        return this.left + this.width;
      },
      get bottom() {
        return this.top + this.height;
      },
    };
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };
};

export default measureLayout;

export const getBoundingClientRect = (node: HTMLElement) => {
  if (node && node.getBoundingClientRect) {
    const rect = node.getBoundingClientRect();

    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      get right() {
        return this.left + this.width;
      },
      get bottom() {
        return this.top + this.height;
      },
    };
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };
};
