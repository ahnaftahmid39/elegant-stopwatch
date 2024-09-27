import { useEffect, useRef } from "react";

function useInterval({
  callback,
  delay,
  immediate,
}: {
  callback: () => void;
  delay: number | null;
  immediate: boolean | undefined;
}) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      if (immediate) tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, immediate]);
}

export default useInterval;
