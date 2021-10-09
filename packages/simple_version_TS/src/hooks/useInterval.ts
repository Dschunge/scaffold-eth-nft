import React, { useState, useEffect, useRef } from 'react';

/* How to use it in another component
  const [count, setCount] = useState(0);
  useInterval(() => {
   // Your custom logic here
   setCount(count + 1);
  }, 1000);
*/


export default function useInterval(callback: any, delay: any) {   
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {    
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}