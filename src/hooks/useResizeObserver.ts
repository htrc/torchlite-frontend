import { useEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useResizeObserver = (ref: any) => {
  const [dimensions, setDimensions] = useState<any>(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
